import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { callService } from '../helpers/http.helper';
import { SERVICES } from '../../config/services.config';

@ObjectType()
class UserType {
  @Field(() => ID) id: string;
  @Field() email: string;
  @Field() role: string;
  @Field() createdAt: string;
}

@ObjectType()
class AuthResponseType {
  @Field() token: string;
  @Field(() => UserType) user: UserType;
}

@InputType()
class RegisterInput {
  @Field() email: string;
  @Field() password: string;
  @Field({ nullable: true }) role?: string;
}

@InputType()
class LoginInput {
  @Field() email: string;
  @Field() password: string;
}

@Resolver()
export class AuthGatewayResolver {
  @Mutation(() => AuthResponseType)
  async register(@Args('input') input: RegisterInput): Promise<AuthResponseType> {
    const data = await callService(SERVICES.AUTH, `
      mutation Register($input: RegisterInput!) {
        register(input: $input) {
          token
          user { id email role createdAt }
        }
      }
    `, { input });
    return data.register;
  }

  @Mutation(() => AuthResponseType)
  async login(@Args('input') input: LoginInput): Promise<AuthResponseType> {
    const data = await callService(SERVICES.AUTH, `
      mutation Login($input: LoginInput!) {
        login(input: $input) {
          token
          user { id email role createdAt }
        }
      }
    `, { input });
    return data.login;
  }
}