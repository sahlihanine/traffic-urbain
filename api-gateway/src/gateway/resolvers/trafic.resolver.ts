import { Resolver, Query, Mutation, Args, ObjectType, Field, ID, Float, Int, InputType } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { callService } from '../helpers/http.helper';
import { SERVICES } from '../../config/services.config';
import { GqlAuthGuard } from '../guards/gql-auth.guard';

@ObjectType()
class TrafficZoneType {
  @Field(() => ID) id: string;
  @Field() nom: string;
  @Field(() => Float) latMin: number;
  @Field(() => Float) latMax: number;
  @Field(() => Float) lonMin: number;
  @Field(() => Float) lonMax: number;
  @Field(() => Int) nombreVehicules: number;
  @Field() niveauTrafic: string;
}

@InputType()
class CreateZoneInput {
  @Field() nom: string;
  @Field(() => Float) latMin: number;
  @Field(() => Float) latMax: number;
  @Field(() => Float) lonMin: number;
  @Field(() => Float) lonMax: number;
}

@InputType()
class UpdateDensiteInput {
  @Field(() => ID) zoneId: string;
  @Field(() => Int) nombreVehicules: number;
}

@Resolver()
export class TraficGatewayResolver {
  @Query(() => [TrafficZoneType])
  @UseGuards(GqlAuthGuard)
  async zones(): Promise<TrafficZoneType[]> {
    const data = await callService(SERVICES.TRAFIC, `
      query { zones { id nom latMin latMax lonMin lonMax nombreVehicules niveauTrafic } }
    `);
    return data.zones;
  }

  @Query(() => [TrafficZoneType])
  @UseGuards(GqlAuthGuard)
  async zonesCongestionnees(): Promise<TrafficZoneType[]> {
    const data = await callService(SERVICES.TRAFIC, `
      query { zonesCongestionnees { id nom nombreVehicules niveauTrafic } }
    `);
    return data.zonesCongestionnees;
  }

  @Mutation(() => TrafficZoneType)
  @UseGuards(GqlAuthGuard)
  async creerZone(@Args('input') input: CreateZoneInput): Promise<TrafficZoneType> {
    const data = await callService(SERVICES.TRAFIC, `
      mutation CreerZone($input: CreateZoneInput!) {
        creerZone(input: $input) { id nom niveauTrafic nombreVehicules }
      }
    `, { input });
    return data.creerZone;
  }

  @Mutation(() => TrafficZoneType)
  @UseGuards(GqlAuthGuard)
  async updateDensite(@Args('input') input: UpdateDensiteInput): Promise<TrafficZoneType> {
    const data = await callService(SERVICES.TRAFIC, `
      mutation UpdateDensite($input: UpdateDensiteInput!) {
        updateDensite(input: $input) { id nom nombreVehicules niveauTrafic }
      }
    `, { input });
    return data.updateDensite;
  }
}
