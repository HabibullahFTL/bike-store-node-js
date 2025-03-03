import { RequestHandler } from 'express';
import httpStatus from 'http-status';
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

const UserControllers = { createAdmin, customerRegistration, getAllUsers };

export default UserControllers;
