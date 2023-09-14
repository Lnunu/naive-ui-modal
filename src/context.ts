import type { InjectionKey } from "vue";
import { MessageApiInjection } from "./MessageProvider";

export function createInjectionKey<T>(key: string): InjectionKey<T> {
  return key as any;
}

export const messageInjectionKey = createInjectionKey<MessageApiInjection>("message-api");
