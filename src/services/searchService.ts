import searchRepository from '../repositories/searchRepository.js';
import { SearchUserParams } from '../types/userTypes.js';

class SearchService {
  async getAllUsersWithoutUserThatRequested(params: SearchUserParams) {
    const allUsers = await searchRepository.getAllUsersExceptRequestedUser(params);
    return allUsers;
  }
}

export default new SearchService();
