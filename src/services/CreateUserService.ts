import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';
import AppError from '../errors/AppError';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const userModel = getRepository(User);

    const emailExists = await userModel.findOne({
      where: { email },
    });

    if (emailExists) {
      throw new AppError('Email already exists.');
    }

    const hashedPassword = await hash(password, 8);

    const user = userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    await userModel.save(user);

    return user;
  }
}

export default CreateUserService;
