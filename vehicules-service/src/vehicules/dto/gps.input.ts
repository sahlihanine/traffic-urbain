import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class GpsInput {
  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;

  @Field(() => Float, { nullable: true })
  vitesse?: number;
}