import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(input: RegisterInput): Promise<AuthResponse> {
    const hashed = await bcrypt.hash(input.password, 10);
    const user = this.userRepo.create({ ...input, password: hashed });
    await this.userRepo.save(user);
    const token = this.jwtService.sign({ sub: user.id, role: user.role });
    return { token, user };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.userRepo.findOne({ where: { email: input.email } });
    if (!user || !(await bcrypt.compare(input.password, user.password)))
      throw new UnauthorizedException('Identifiants invalides');
    const token = this.jwtService.sign({ sub: user.id, role: user.role });
    return { token, user };
  }
}
