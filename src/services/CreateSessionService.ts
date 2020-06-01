import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '../models/User';
import AppError from '../errors/AppError';

import authConfig from '../config/auth';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class CreateSessionService {
  public async execute({ email, password }: Request): Promise<Response> {
    const userModel = getRepository(User);

    const user = await userModel.findOne({
      where: { email },
    });

    if (!user) {
      throw new AppError('Incorrect Email/Password Combination.', 401);
    }

    const passwordTrue = await compare(password, user.password);

    if (!passwordTrue) {
      throw new AppError('Incorrect Email/Password Combination.', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }
}

export default CreateSessionService;
