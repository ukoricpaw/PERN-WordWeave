import { MessageInstance } from '../models/Message.js';
import { RoomInstance } from '../models/Room.js';
import { UserInstance } from '../models/User.js';

export type RoomsType = {
  count: number;
  rows: RoomInstance[];
};

export type IRooms = [RoomsType, RoomsType];

export interface RoomResponse {
  room: null | RoomInstance;
  messages: null | MessageInstance[];
  user: UserInstance | null;
}

export interface RoomWithLastMessage extends Omit<RoomResponse, 'messages'> {
  lastMessage: {
    text: string | null;
  };
}
