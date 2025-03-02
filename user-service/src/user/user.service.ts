import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject('NOTIFICATION_SERVICE') private readonly client: ClientProxy,
  ) {}

  async createUser(username: string): Promise<User> {
    const user = this.userRepository.create({ username });
    await this.userRepository.save(user);
    this.logger.log(`User created with id ${user.id}`);

    this.client.emit('user.created', { userId: user.id, username: user.username });
    return user;
  }
}