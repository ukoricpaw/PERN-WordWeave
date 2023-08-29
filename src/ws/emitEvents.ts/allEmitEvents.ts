export interface EmittersEvents {
  provideMessage: string;
  joinToChatOnClientSide: string;
}

export const emitEvents = (): EmittersEvents => {
  return {
    provideMessage: 'message:getMessage',
    joinToChatOnClientSide: 'chat-client:join',
  };
};
