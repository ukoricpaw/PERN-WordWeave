export interface EmittersEvents {
  provideMessage: string;
}

export const emitEvents = (): EmittersEvents => {
  return {
    provideMessage: 'message:getMessage',
  };
};
