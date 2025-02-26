import { model, Schema } from 'mongoose';
import { hashPassword } from '../auth/auth.utils';
import { USER_ROLES, USER_STATUS } from './user.constrants';
import { TUser, TUserModel } from './user.interfaces';

// User Schema
const userSchema = new Schema<TUser, TUserModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [30, 'Name cannot exceed 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [6, 'Minimum 6 character is required.'],
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
      select: 0,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Pre middleware which will run before saving
userSchema.pre('save', async function () {
  // Throwing error if no password
  if (!this.password) {
    throw new Error('Password is required');
  }

  // Hashing password
  const hashedPassword = await hashPassword(this.password);

  // Swapping the hashed password
  this.password = hashedPassword;
  return this as TUser;
});

// Post middleware which will run after saving
userSchema.post('save', async function () {
  this.password = undefined;
  this.passwordChangedAt = undefined;
  this.isDeleted = undefined;

  return this;
});

// For checking is user already exists or not
userSchema.static(
  'isUserExists',
  async function (email: string, shouldIncludePassword: boolean) {
    // Constructing query
    const userQuery = this.findOne({ email });

    let user: TUser | null;

    // Executing query based on condition
    if (shouldIncludePassword) {
      user = await userQuery.select('+password');
    } else {
      user = await userQuery;
    }

    return user;
  }
);

// For getting user data by id
userSchema.static(
  'userDataById',
  async function (userId: string, shouldIncludePassword: boolean) {
    // Constructing query
    const userQuery = this.findById(userId);

    let user: TUser | null;

    // Executing query based on condition
    if (shouldIncludePassword) {
      user = await userQuery.select('+password');
    } else {
      user = await userQuery;
    }

    return user;
  }
);

// For checking is JWT token issued before password changed
userSchema.static(
  'isJWTIssuedBeforePasswordChanged',
  function (passwordChangedAt: string, iat: number) {
    // Checking refresh token issued before password change or not
    const passwordChangedAtTime = passwordChangedAt
      ? new Date(passwordChangedAt).getTime() / 1000
      : 0;
    const tokenIssuedAt = iat || 0;

    if (passwordChangedAtTime > tokenIssuedAt) {
      throw new Error('Invalid refresh token.');
    }
  }
);

// User model
const UserModel = model<TUser, TUserModel>('User', userSchema);

export default UserModel;
