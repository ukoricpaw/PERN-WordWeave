export interface EmittersEvents {
  provideMessage: string;
  joinToChatOnClientSide: string;
  provideMessageToRoom: string;
}

export const emitEvents = (): EmittersEvents => {
  return {
    provideMessage: 'message:getMessage',
    joinToChatOnClientSide: 'chat-client:join',
    provideMessageToRoom: 'message:getNotificationMessage',
  };
};
