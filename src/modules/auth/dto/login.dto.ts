import { UserRole } from '../../../common/enums/roles.enum';

export class LoginDTO {
  username: string;
  password: string;
  roles: UserRole[];
}