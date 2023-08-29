import { Op } from 'sequelize';
import { Room } from '../models/Room.js';
import { Message } from '../models/Message.js';
import ApiError from '../error/ApiError.js';

class ChatRepository {
  async findRoomByContactIds({ user1Id, user2Id }: { user1Id: number; user2Id: number }) {
    const roomWithUser = await Room.findOne({
      where: {
        [Op.or]: [
          {
            user1Id,
            user2Id,
          },
          {
            user1Id: user2Id,
            user2Id: user1Id,
          },
        ],
      },
    });
    return roomWithUser;
  }

  async countOfRoomMessages(roomId: number) {
    const count = await Message.count({ where: { roomId } });
    return count;
  }

  async findRoomById(roomId: number) {
    const room = await Room.findOne({ where: { id: roomId } });
    return room;
  }

  async findRoomIfIsEmptyThrowError(roomId: number) {
    const room = await this.findRoomById(roomId);
    if (!room) {
      throw ApiError.badRequest('Чат не найден', null);
    }
  }

  async createDialogRoom({ user1Id, user2Id }: { user1Id: number; user2Id: number }) {
    const room = await Room.create({
      isGroup: false,
      avatar: null,
      description: null,
      name: null,
      user1Id,
      user2Id,
    });
    return room;
  }

  async findMessages({ roomId, limit, page }: { roomId: number; limit: number; page: number }) {
    const offset = limit * page - limit;
    const messages = await Message.findAndCountAll({
      where: {
        roomId,
      },
      order: [['createdAt', 'DESC']],
      offset,
      limit,
    });
    return messages;
  }

  async getRoomAndRoomIdBySearchingRoom({ user1Id, user2Id }: { user1Id: number; user2Id: number }) {
    let room = await this.findRoomByContactIds({
      user1Id,
      user2Id,
    });
    let roomId: null | number = null;
    if (!room) {
      room = await this.createDialogRoom({
        user1Id,
        user2Id,
      });
    }
    roomId = room.id;
    return { roomId, room };
  }
}

export default new ChatRepository();
