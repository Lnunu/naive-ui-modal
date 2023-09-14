import { ModalApiInjection } from "./ModalProvider";
import { inject } from "vue";
import { modalInjectionKey } from "./context";

export function useModal(): ModalApiInjection {
  const modal = inject(modalInjectionKey, null);
  if (modal === null) {
    throwError("use-modal", "No outer <modal-provider/> founded.");
  }

  return modal;
}

function throwError(location: string, message: string): never {
  throw new Error(`[${location}]: ${message}`);
}
