import { CSSProperties, Fragment, VNode, defineComponent, h, provide, reactive, ref } from "vue";
import { modalInjectionKey } from "./context";
import { ModalProps } from "naive-ui";
import { ModalEnvironment } from "./ModalEnvironment";

export type ModalOptions = ModalProps & {
  content: () => VNode;
};

export type ModalReactive = {
  readonly key: string;
  readonly destory: () => void;
} & ModalOptions;

export interface ModalApiInjection {
  destoryAll: () => void;
  create: (options: ModalOptions) => ModalReactive;
}

type TypeSafeModalReactive = ModalReactive & {
  class?: string;
  style?: CSSProperties;
};

interface ModalInst {
  hide: () => void;
}

export const ModalProvider = defineComponent({
  name: "ModalProvider",
  setup() {
    const modalListRef = ref<TypeSafeModalReactive[]>([]);

    const modalInstRefs: Record<string, ModalInst> = {};

    const api: ModalApiInjection = {
      create,
      destoryAll,
    };

    function create(options: ModalOptions) {
      const key = createId();
      const modalReactive = reactive<ModalReactive>({
        ...options,
        key,
        destory: () => {},
      });
      modalListRef.value.push(modalReactive);
      return modalReactive;
    }

    function destoryAll() {}

    provide(modalInjectionKey, api);

    function handleAfterLeave(key: string) {
      const modalList = modalListRef.value;
      modalList.splice(
        modalList.findIndex((modal) => modal.key === key),
        1
      );
    }

    return {
      modalListRef,
      modalInstRefs,
      handleAfterLeave,
    };
  },
  render() {
    const { modalInstRefs, handleAfterLeave } = this;
    return h(Fragment, null, [
      this.modalListRef.map((modal) =>
        h(ModalEnvironment, {
          ...modal,
          content: modal.content,
          internalKey: modal.key,
          onInternalAfterLeave: handleAfterLeave,
          ref: ((inst: ModalInst) => {
            if (inst === null) {
              Reflect.deleteProperty(modalInstRefs, `modal-${modal.key}`);
            } else {
              Reflect.set(modalInstRefs, `modal-${modal.key}`, inst);
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
