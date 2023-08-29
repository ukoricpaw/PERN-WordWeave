import { Message } from '../models/Message.js';
import chatRepository from './chatRepository.js';

class MessageRepository {
  async createMessage(userId: number, roomId: number, message: string) {
    await chatRepository.findRoomById(roomId);
    const newMessage = await Message.create({
      text: message,
      isChanged: false,
      isFixed: false,
      dateOfFix: null,
      roomId,
      receiverId: userId,
    });
    return newMessage;
  }
}

export default new MessageRepository();
