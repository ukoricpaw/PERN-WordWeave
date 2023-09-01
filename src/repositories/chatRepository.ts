import { Op } from 'sequelize';
import { Room, RoomInstance } from '../models/Room.js';
import { Message, MessageInstance } from '../models/Message.js';
import ApiError from '../error/ApiError.js';
import { RoomMembers } from '../models/RoomMembers.js';
import { IRooms } from '../types/roomTypes.js';
import { UserSessionParams } from '../types/userTypes.js';
import { UserInstance } from '../models/User.js';
import messageRepository from './messageRepository.js';
import userRepository from './userRepository.js';

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
    let isNew: boolean = false;
    let room = await this.findRoomByContactIds({
      user1Id,
      user2Id,
    });
    let roomId: null | number = null;
    if (!room) {
      isNew = true;
      room = await this.createDialogRoom({
        user1Id,
        user2Id,
      });
    }
    roomId = room.id;
    return { roomId, room, isNew };
  }

  async getAllRoomsById(userId: number) {
    const dialogRooms = Room.findAndCountAll({
      where: {
        isGroup: false,
        [Op.or]: [
          {
            user1Id: userId,
          },
          {
            user2Id: userId,
          },
        ],
      },
      attributes: {
        exclude: ['avatar', 'description', 'isGroup', 'name'],
      },
      limit: 20,
    });
    const groupRooms = Room.findAndCountAll({
      where: {
        isGroup: true,
      },
      attributes: {
        exclude: ['user1Id', 'user2Id'],
      },
      include: [
        {
          model: RoomMembers,
          where: {
            memberId: userId,
          },
        },
      ],
      limit: 20,
    });
    const rooms = await Promise.all([dialogRooms, groupRooms]);
    return rooms;
  }

  async getRoomsWithLastMessageAndUserInfo(rooms: IRooms, userSessionParams: UserSessionParams) {
    const dialogRooms = {
      count: rooms[0].count,
      rows: [] as {
        room: RoomInstance;
        user: UserInstance;
        lastMessage?: MessageInstance;
      }[],
    };
    const groupRooms = {
      count: rooms[1].count,
      rows: [] as {
        room: RoomInstance;
        lastMessage?: MessageInstance;
      }[],
    };

    await Promise.all(
      [...rooms[0].rows, ...rooms[1].rows].map(async room => {
        const lastMessage = await messageRepository.findLastMessageInChatByRoomId(room.id);
        if (lastMessage) {
          if (room.isGroup) {
            groupRooms.rows.push({
              room,
              lastMessage,
            });
          } else {
            const user = await userRepository.findUserByRoomsIds(userSessionParams.userId, room);
            if (user) {
              dialogRooms.rows.push({
                room,
                user,
                lastMessage,
              });
            }
          }
        }
      }),
    );
    return { dialogRooms, groupRooms };
  }
}

export default new ChatRepository();
