import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';
import { Role } from '../enums/role.enum';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(6)
  password: string;

  @Field(() => Role, { nullable: true })
  role?: Role;
}