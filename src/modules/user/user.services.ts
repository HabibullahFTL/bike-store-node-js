import { USER_ROLES, USER_STATUS } from './user.constrants';
import { TCreateUser, TUserRole } from './user.interfaces';
import UserModel from './user.model';

const createUserIntoDB = async (userData: TCreateUser, userRole: TUserRole) => {
  const adminData = await UserModel.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userRole || USER_ROLES.CUSTOMER,
    status: USER_STATUS.ACTIVE,
  });

  return adminData;
};

const getAllUsersFromDB = async () => {
  return await UserModel.find({});
};

const UserServices = { createUserIntoDB, getAllUsersFromDB };

export default UserServices;
