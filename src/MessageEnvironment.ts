import { NAlert, NModal, modalProps } from "naive-ui";
import { PropType, VNode, defineComponent, h, ref } from "vue";

export const MessageEnvironment = defineComponent({
  name: "MessageEnvironment",
  props: {
    ...modalProps,
    internalKey: {
      type: String,
      required: true,
    },
    onInternalAfterLeave: {
      type: Function as PropType<(key: string) => void>,
      required: true,
    },
    content: {
      type: Function as PropType<() => VNode>,
      required: true,
    },
  },
  setup(props) {
    const isShowModal = ref<boolean>(true);

    function handleAfterLeave() {
      const { onInternalAfterLeave, internalKey, onAfterLeave } = props;
      if (onInternalAfterLeave) onInternalAfterLeave(internalKey);
      if (onAfterLeave) onAfterLeave();
    }

    function handleUpdateShow(show: boolean) {
      isShowModal.value = show;
    }

    return {
      isShowModal,
      handleAfterLeave,
      handleUpdateShow,
    };
  },
  render() {
    const { isShowModal, handleAfterLeave, handleUpdateShow, content } = this;
    return h(
      NModal,
      {
        ...this.$props,
        show: isShowModal,
        internalAppear: true,
        onUpdateShow: handleUpdateShow,
        onAfterLeave: handleAfterLeave,
      },
      {
        default: content,
      }
    );
  },
});
