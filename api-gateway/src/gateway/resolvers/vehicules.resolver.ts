import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
  ID,
  Float,
  InputType,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { callService } from '../helpers/http.helper';
import { SERVICES } from '../../config/services.config';
import { GqlAuthGuard } from '../guards/gql-auth.guard';

@ObjectType()
class VehicleType {
  @Field(() => ID) id: string;
  @Field() immatriculation: string;
  @Field() marque: string;
  @Field() modele: string;
  @Field() type: string;
  @Field() actif: boolean;
}

@ObjectType()
class GpsPositionType {
  @Field(() => ID) id: string;
  @Field(() => Float) latitude: number;
  @Field(() => Float) longitude: number;
  @Field(() => Float, { nullable: true }) vitesse: number;
  @Field() timestamp: string;
  @Field() vehicleId: string;
}

@InputType()
class CreateVehicleInput {
  @Field() immatriculation: string;
  @Field() marque: string;
  @Field() modele: string;
  @Field() type: string;
}

@InputType()
class GpsInput {
  @Field(() => Float) latitude: number;
  @Field(() => Float) longitude: number;
  @Field(() => Float, { nullable: true }) vitesse?: number;
}

@Resolver()
export class VehiculesGatewayResolver {
  @Query(() => [VehicleType])
  @UseGuards(GqlAuthGuard)
  async vehicles(): Promise<VehicleType[]> {
    const data = await callService(
      SERVICES.VEHICULES,
      `
      query { vehicles { id immatriculation marque modele type actif } }
    `,
    );
    return data.vehicles;
  }

  @Query(() => VehicleType)
  //@UseGuards(GqlAuthGuard)
  async vehicle(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<VehicleType> {
    const data = await callService(
      SERVICES.VEHICULES,
      `
      query Vehicle($id: ID!) {
        vehicle(id: $id) { id immatriculation marque modele type actif }
      }
    `,
      { id },
    );
    return data.vehicle;
  }

  @Mutation(() => VehicleType)
  @UseGuards(GqlAuthGuard)
  async createVehicle(
    @Args('input') input: CreateVehicleInput,
  ): Promise<VehicleType> {
    const data = await callService(
      SERVICES.VEHICULES,
      `
      mutation CreateVehicle($input: CreateVehicleInput!) {
        createVehicle(input: $input) { id immatriculation marque modele type actif }
      }
    `,
      { input },
    );
    return data.createVehicle;
  }

  @Mutation(() => GpsPositionType)
  @UseGuards(GqlAuthGuard)
  async addGpsPosition(
    @Args('vehicleId', { type: () => ID }) vehicleId: string,
    @Args('input') input: GpsInput,
  ): Promise<GpsPositionType> {
    const data = await callService(
      SERVICES.VEHICULES,
      `
      mutation AddGps($vehicleId: ID!, $input: GpsInput!) {
        addGpsPosition(vehicleId: $vehicleId, input: $input) {
          id latitude longitude vitesse timestamp vehicleId
        }
      }
    `,
      { vehicleId, input },
    );
    return data.addGpsPosition;
  }
}
