import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsIn } from 'class-validator';

@InputType()
export class CreateNotificationInput {
  @Field()
  @IsNotEmpty()
  titre: string;

  @Field()
  @IsNotEmpty()
  message: string;

  @Field()
  @IsNotEmpty()
  destinataireId: string;

  @Field({ nullable: true })
  @IsIn(['INCIDENT', 'TRAFIC', 'SYSTEME'])
  type?: string;
}
