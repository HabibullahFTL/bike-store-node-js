import { RequestHandler } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { generateResponse } from '../../utils/response-generator';
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
  res.json(
    generateResponse({
      success: true,
      data: adminData,
      message: 'Created a new admin successfully.',
    })
  );
});

// Handle registration of customer
const customerRegistration: RequestHandler = catchAsync(async (req, res) => {
  const userData = req.body;
  const customerData = await UserServices.createUserIntoDB(
    userData,
    USER_ROLES.CUSTOMER
  );

  res.json(
    generateResponse({
      success: true,
      data: customerData,
      message: 'Successfully registered your account.',
    })
  );
});

// Handle getting all users
const getAllUsers = catchAsync(async (req, res) => {
  const allUsers = await UserServices.getAllUsersFromDB();

  res.json(
    generateResponse({
      success: true,
      data: allUsers,
      message: 'Retrieved all users successfully.',
    })
  );
});

const UserControllers = { createAdmin, customerRegistration, getAllUsers };

export default UserControllers;
