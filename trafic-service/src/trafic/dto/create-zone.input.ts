import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, Min, Max } from 'class-validator';

@InputType()
export class CreateZoneInput {
  @Field()
  @IsNotEmpty()
  nom: string;

  @Field(() => Float)
  @Min(-90)
  @Max(90)
  latMin: number;

  @Field(() => Float)
  @Min(-90)
  @Max(90)
  latMax: number;

  @Field(() => Float)
  @Min(-180)
  @Max(180)
  lonMin: number;

  @Field(() => Float)
  @Min(-180)
  @Max(180)
  lonMax: number;
}
