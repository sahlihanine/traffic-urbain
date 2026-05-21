import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './dto/auth-response.dto';
import { User } from './entities/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async register(@Args('input') input: RegisterInput) {
    return this.authService.register(input);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginInput) {
    return this.authService.login(input);
  }

  @Query(() => User, { nullable: true })
  me() {
    return null; // à compléter avec le guard JWT plus tard
  }
}
