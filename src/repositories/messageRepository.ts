import { Message } from '../models/Message.js';
import { User } from '../models/User.js';
import { userExcludeAttributes } from '../types/userTypes.js';
import chatRepository from './chatRepository.js';

class MessageRepository {
  async createMessage(userId: number, roomId: number, message: string) {
    await chatRepository.findRoomIfIsEmptyThrowError(roomId);
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

  async findLastMessageInChatByRoomId(roomId: number) {
    const lastMessage = await Message.findOne({
      where: { roomId },
      order: [['createdAt', 'DESC']],
      attributes: {
        exclude: ['dateOfFix', 'receiverId', 'roomId', 'id', 'updatedAt', 'isChanged'],
      },
      include: [
        {
          model: User,
          attributes: userExcludeAttributes,
        },
      ],
    });
    return lastMessage;
  }
}

export default new MessageRepository();
