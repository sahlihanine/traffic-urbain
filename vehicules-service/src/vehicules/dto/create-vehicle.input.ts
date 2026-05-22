import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsIn } from 'class-validator';

@InputType()
export class CreateVehicleInput {
  @Field()
  @IsNotEmpty()
  immatriculation: string;

  @Field()
  @IsNotEmpty()
  marque: string;

  @Field()
  @IsNotEmpty()
  modele: string;

  @Field()
  @IsIn(['VOITURE', 'CAMION', 'MOTO', 'BUS'])
  type: string;
}
