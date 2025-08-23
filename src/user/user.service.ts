import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return await this.repo.save(user);
  }

  async findOne(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    console.log(user);

    if (!user) {
      return new NotFoundException('User not exist');
    }
    return user;
  }

  async find(email: string) {
    return await this.repo.find({ where: { email } });
  }

  async update(id: number, attr: Partial<User>) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      return new NotFoundException('User not exist');
    }
    Object.assign(user, attr);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      return new NotFoundException('User not exist');
    }
    return this.repo.remove(user);
  }
}
