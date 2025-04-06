import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/response-generator';
import { USER_ROLES } from './user.constrants';
import UserServices from './user.services';

// Handle creation of admin
const createAdmin = catchAsync(async (req, res) => {
  // Creating a user in database
  const adminData = await UserServices.createUserIntoDB(
    req.body,
    USER_ROLES.ADMIN
  );

  // Sending response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: adminData,
    message: 'Created a new admin successfully.',
  });
});

// Handle registration of customer
const customerRegistration: RequestHandler = catchAsync(async (req, res) => {
  const userData = req.body;

  const customerData = await UserServices.createUserIntoDB(
    userData,
    USER_ROLES.CUSTOMER
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: customerData,
    message: 'Successfully registered your account.',
  });
});

// Handle getting all users
const getAllUsers = catchAsync(async (req, res) => {
  const allUsers = await UserServices.getAllUsersFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: allUsers,
    message: 'Retrieved all users successfully.',
  });
});

// Handle blocking a user
const blockUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  console.log('Blocking', { userId });

  const user = await UserServices.changeUserStatusInDB(userId, true);

  // Check if the user exists
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
  }

  // Check if the user is already blocked
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: user,
    message: 'User blocked successfully.',
  });
});

// Handle unblocking a user
const unblockUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const user = await UserServices.changeUserStatusInDB(userId, false);

  // Check if the user exists
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
  }

  // Check if the user is already blocked
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: user,
    message: 'User blocked successfully.',
  });
});

// Handle changing role of a user
const changeRole = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  const user = await UserServices.changeUserRoleInDB(userId, role);

  // Check if the user exists
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
  }

  // Check if the user is already blocked
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: user,
    message: 'User role changed successfully.',
  });
});

const UserControllers = {
  createAdmin,
  customerRegistration,
  getAllUsers,
  blockUser,
  unblockUser,
  changeRole,
};

export default UserControllers;
