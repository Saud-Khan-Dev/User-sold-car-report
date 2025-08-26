import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signup(email: string, password: string) {
    const existUser = await this.userService.find(email);
    if (existUser.length !== 0) {
      throw new BadRequestException('email already in use');
    }

    const salt = randomBytes(8).toString('hex');

    const hashPassword = (await scrypt(password, salt, 32)) as Buffer;

    const result = salt + '.' + hashPassword.toString('hex');

    const user = await this.userService.create(email, result);

    return user;
  }

  async signin(email: string, password: string) {
    const [existUser] = await this.userService.find(email);
    if (!existUser) {
      throw new NotFoundException('User does not exist');
    }
    const [salt, hashedPassword] = existUser.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hashedPassword !== hash.toString('hex')) {
      return existUser;
    } else {
      throw new BadRequestException('Invalid credentials');
    }
  }
}
