import { Token } from './Token.js';
import { User } from './User.js';

User.hasOne(Token, {
  foreignKey: 'userId',
  sourceKey: 'id',
});

Token.belongsTo(User, {
  foreignKey: 'userId',
});

export default { Token, User };
