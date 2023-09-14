import { CSSProperties, Fragment, VNode, defineComponent, h, provide, reactive, ref } from "vue";
import { messageInjectionKey } from "./context";
import { ModalProps } from "naive-ui";
import { MessageEnvironment } from "./MessageEnvironment";

export type MessageOptions = ModalProps & {
  content: () => VNode;
};

export type MessageReactive = {
  readonly key: string;
  readonly destory: () => void;
} & MessageOptions;

export interface MessageApiInjection {
  destoryAll: () => void;
  create: (options: MessageOptions) => MessageReactive;
}

type TypeSafeMessageReactive = MessageReactive & {
  class?: string;
  style?: CSSProperties;
};

interface MessageInst {
  hide: () => void;
}

export const MessageProvider = defineComponent({
  name: "MessageProvider",
  setup() {
    const messageListRef = ref<TypeSafeMessageReactive[]>([]);

    const messageInstRefs: Record<string, MessageInst> = {};

    const api: MessageApiInjection = {
      create,
      destoryAll,
    };

    function create(options: MessageOptions) {
      const key = createId();
      const messageReactive = reactive<MessageReactive>({
        ...options,
        key,
        destory: () => {},
      });
      messageListRef.value.push(messageReactive);
      return messageReactive;
    }

    function destoryAll() {}

    provide(messageInjectionKey, api);

    function handleAfterLeave(key: string) {
      const messageList = messageListRef.value;
      messageList.splice(
        messageList.findIndex((message) => message.key === key),
        1
      );
    }

    return {
      messageListRef,
      messageInstRefs,
      handleAfterLeave,
    };
  },
  render() {
    const { messageInstRefs, handleAfterLeave } = this;
    return h(Fragment, null, [
      this.messageListRef.map((message) =>
        h(MessageEnvironment, {
          ...message,
          content: message.content,
          internalKey: message.key,
          onInternalAfterLeave: handleAfterLeave,
          ref: ((inst: MessageInst) => {
            if (inst === null) {
              Reflect.deleteProperty(messageInstRefs, `message-${message.key}`);
            } else {
              Reflect.set(messageInstRefs, `message-${message.key}`, inst);
            }
          }) as any,
        })
      ),
      this.$slots.default?.(),
    ]);
  },
});

function createId() {
  return Date.now().toLocaleString();
}
