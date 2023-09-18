import chatRepository from '../repositories/chatRepository.js';

class MessagesService {
  async getMessagesByRoom(roomId: number, page: number, limit: number) {
    const messages = await chatRepository.findMessages({ roomId, limit, page });
    return messages;
  }
}

export default new MessagesService();
