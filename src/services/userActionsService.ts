import ApiError from '../error/ApiError.js';
import { FriendContact } from '../models/FriendContact.js';
import userRepository from '../repositories/userRepository.js';

class UserActionsService {
  async makeFriendsWith({ userId, possibleFriendId }: { userId: number; possibleFriendId: number }) {
    if (userId == possibleFriendId) {
      throw ApiError.badRequest('Ошибка запроса', null);
    }
    await userRepository.checkCandidateById(possibleFriendId);
    await FriendContact.create({ user1Id: userId, user2Id: possibleFriendId });
    return { message: 'Вы добавили пользователя в друзья' };
  }
}

export default new UserActionsService();
