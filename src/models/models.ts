import { Message } from './Message.js';
import { Room } from './Room.js';
import { RoomMembers } from './RoomMembers.js';
import { Token } from './Token.js';
import { User } from './User.js';

User.hasOne(Token, {
  foreignKey: 'userId',
  sourceKey: 'id',
});

Token.belongsTo(User, {
  foreignKey: 'userId',
});

User.hasMany(Message, {
  foreignKey: 'receiverId',
  sourceKey: 'id',
});

Message.belongsTo(User, {
  foreignKey: 'receiverId',
});

Room.hasMany(Message, {
  foreignKey: 'roomId',
  sourceKey: 'id',
});

Message.belongsTo(Room, {
  foreignKey: 'roomId',
});

User.hasMany(RoomMembers, {
  foreignKey: 'memberId',
  sourceKey: 'id',
});

RoomMembers.belongsTo(User, {
  foreignKey: 'memberId',
});

Room.hasMany(RoomMembers, {
  foreignKey: 'roomId',
  sourceKey: 'id',
});

RoomMembers.belongsTo(Room, {
  foreignKey: 'roomId',
});

export default { Token, User, Room, RoomMembers, Message };
