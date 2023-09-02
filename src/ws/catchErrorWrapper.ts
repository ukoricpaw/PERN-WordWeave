import { MessageType } from '../types/requestTypes.js';

export const catchErrorWrapper =
  (emitError: (err: MessageType) => void) =>
  <T extends any[]>(handler: (...args: T) => Promise<void>) =>
  async (...args: T) => {
    try {
      await handler(...args);
    } catch (err) {
      emitError(err as MessageType);
    }
  };
