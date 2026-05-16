import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { TypeIncident } from '../enums/type-incident.enum';

@InputType()
export class CreateIncidentInput {
  @Field(() => TypeIncident)
  type: TypeIncident;

  @Field()
  @IsNotEmpty()
  description: string;

  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;

  @Field()
  @IsNotEmpty()
  declarePar: string;
}