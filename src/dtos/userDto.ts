import { UserInstance } from '../models/User.js';

class UserDto {
  public id: number;
  public email: string;
  public avatar: string | null;
  public isActivated: boolean;
  constructor(user: UserInstance) {
    this.id = user.id;
    this.email = user.email;
    this.avatar = user.avatar;
    this.isActivated = user.isActivated;
  }
}

export default UserDto;
