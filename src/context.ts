import type { InjectionKey } from "vue";
import { ModalApiInjection } from "./ModalProvider";

export function createInjectionKey<T>(key: string): InjectionKey<T> {
  return key as any;
}

export const modalInjectionKey = createInjectionKey<ModalApiInjection>("modal-api");
