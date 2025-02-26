import { TUser } from '../modules/user/user.interfaces';

declare global {
  namespace Express {
    interface Request {
      user: Pick<TUser, '_id' | 'name' | 'email' | 'role' | 'status'> | null;
    }
  }
}
