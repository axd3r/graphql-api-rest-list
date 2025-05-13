import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { AuthResponse } from './types/auth-response.type';
import { SignupInput } from './dto/inputs/signup.input';
import { UsersService } from 'src/users/users.service';
import { LoginInput } from './dto/inputs/login.input copy';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ){}

    private getJwtToken( userId: string ) {
        return this.jwtService.sign({ id: userId });
    }

    async signup(signupInput: SignupInput): Promise<AuthResponse> {
        
        const user = await this.userService.create(signupInput);
        
        //const token = this.jwtService.sign({ id: user.id });
        const token = this.getJwtToken(user.id);

        return {token, user};
    }

    async login(loginInput: LoginInput): Promise<AuthResponse> {
        const {email, password} = loginInput;
        const user = await this.userService.findOneByEmail(email);

        if(!bcrypt.compareSync(password, user.password)) {
            throw new BadRequestException('Email / Password do not match');
        }

        //const token = this.jwtService.sign({ id: user.id });
        const token = this.getJwtToken(user.id);

        return {token, user}

    }

    async revalidateToken(): Promise<User> {
        throw new Error('FindOne action not implemented')
    }
}
