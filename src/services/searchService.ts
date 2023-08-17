import searchRepository from '../repositories/searchRepository.js';
import userRepository from '../repositories/userRepository.js';
import { SearchUserParams } from '../types/userTypes.js';

class SearchService {
  async getAllUsersWithoutUserThatRequested(params: SearchUserParams) {
    const allUsers = await searchRepository.getAllUsersExceptRequestedUser(params);
    return allUsers;
  }

  async getAllFriendContactsWithoutUser(params: SearchUserParams) {
    const requestedUser = await userRepository.findUserById(params.userId);
    const friends = requestedUser.getFriends(params);
    return friends;
  }
}

export default new SearchService();
