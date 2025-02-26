import { RequestHandler } from 'express';

const login: RequestHandler = (req, res) => {
  res.json({});
};

const AuthControllers = { login };

export default AuthControllers;
