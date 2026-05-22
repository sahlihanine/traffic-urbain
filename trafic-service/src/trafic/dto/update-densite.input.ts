import { InputType, Field, ID, Int } from '@nestjs/graphql';

@InputType()
export class UpdateDensiteInput {
  @Field(() => ID)
  zoneId: string;

  @Field(() => Int)
  nombreVehicules: number;
}
