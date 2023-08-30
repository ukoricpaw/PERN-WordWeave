import { RoomInstance } from '../models/Room.js';

export type RoomsType = {
  count: number;
  rows: RoomInstance[];
};

export type IRooms = [RoomsType, RoomsType];
