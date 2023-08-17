import { QueryOfRequest } from '../types/requestTypes.js';
import { SearchUserParams } from '../types/userTypes.js';

export const createSearchParamsByQuery = ({ search, page, limit }: QueryOfRequest, userId: number) => {
  const userParams: SearchUserParams = {
    search: (search as string) || '',
    page: Number(page) || 1,
    limit: Number(limit) || 8,
    userId,
  };

  return userParams;
};
