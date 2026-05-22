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
class IncidentType {
  @Field(() => ID) id: string;
  @Field() type: string;
  @Field() statut: string;
  @Field() description: string;
  @Field(() => Float) latitude: number;
  @Field(() => Float) longitude: number;
  @Field() declarePar: string;
  @Field() createdAt: string;
  @Field({ nullable: true }) updatedAt: string;
}

@InputType()
class CreateIncidentInput {
  @Field() type: string;
  @Field() description: string;
  @Field(() => Float) latitude: number;
  @Field(() => Float) longitude: number;
  @Field() declarePar: string;
}

@InputType()
class UpdateStatutInput {
  @Field(() => ID) id: string;
  @Field() statut: string;
}

@Resolver()
export class IncidentsGatewayResolver {
  @Query(() => [IncidentType])
  @UseGuards(GqlAuthGuard)
  async incidents(): Promise<IncidentType[]> {
    const data = await callService(
      SERVICES.INCIDENTS,
      `
      query { incidents { id type statut description latitude longitude declarePar createdAt } }
    `,
    );
    return data.incidents;
  }

  @Mutation(() => IncidentType)
  @UseGuards(GqlAuthGuard)
  async declarerIncident(
    @Args('input') input: CreateIncidentInput,
  ): Promise<IncidentType> {
    const data = await callService(
      SERVICES.INCIDENTS,
      `
      mutation DeclarerIncident($input: CreateIncidentInput!) {
        declarerIncident(input: $input) { id type statut description createdAt }
      }
    `,
      { input },
    );
    return data.declarerIncident;
  }

  @Mutation(() => IncidentType)
  @UseGuards(GqlAuthGuard)
  async modifierStatutIncident(
    @Args('input') input: UpdateStatutInput,
  ): Promise<IncidentType> {
    const data = await callService(
      SERVICES.INCIDENTS,
      `
      mutation ModifierStatut($input: UpdateStatutInput!) {
        modifierStatutIncident(input: $input) { id type statut updatedAt }
      }
    `,
      { input },
    );
    return data.modifierStatutIncident;
  }
}
