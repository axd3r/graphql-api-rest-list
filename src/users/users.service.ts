import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import { Code, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  private logger = new Logger('UserService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10)
      });

      return await this.userRepository.save(newUser);
      
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({where: {email}});
      
    } catch (error) {
      this.handleDBErrors({
        code: 'error-001',
        details: `${email} not found`
      });
    }
  }

  async findOne(id: string): Promise<User> {
    throw new Error('FindOne action not implemented')
  }

  /* update(id: string, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  } */

  async block(id: string): Promise<User> {
    throw new Error('FindOne action not implemented')
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key', ''));
    }

    if (error.code === 'error-001') {
      throw new BadRequestException(error.details || 'User not found');
    }

    this.logger.error( error )

    throw new InternalServerErrorException('Please check server logs');
  }
}
