import { MessageApiInjection } from "./MessageProvider";
import { inject } from "vue";
import { messageInjectionKey } from "./context";

export function useMessage(): MessageApiInjection {
  const message = inject(messageInjectionKey, null);
  if (message === null) {
    throwError("use-message", "No outer <message-provider/> founded.");
  }

  return message;
}

function throwError(location: string, message: string): never {
  throw new Error(`[${location}]: ${message}`);
}
