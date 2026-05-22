import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
  ID,
  Int,
  InputType,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { callService } from '../helpers/http.helper';
import { SERVICES } from '../../config/services.config';
import { GqlAuthGuard } from '../guards/gql-auth.guard';

@ObjectType()
class NotificationType {
  @Field(() => ID) id: string;
  @Field() titre: string;
  @Field() message: string;
  @Field() destinataireId: string;
  @Field() lue: boolean;
  @Field({ nullable: true }) type: string;
  @Field() createdAt: string;
}

@InputType()
class CreateNotificationInput {
  @Field() titre: string;
  @Field() message: string;
  @Field() destinataireId: string;
  @Field({ nullable: true }) type?: string;
}

@Resolver()
export class NotificationsGatewayResolver {
  @Query(() => [NotificationType])
  @UseGuards(GqlAuthGuard)
  async notificationsByDestinataire(
    @Args('destinataireId') destinataireId: string,
  ): Promise<NotificationType[]> {
    const data = await callService(
      SERVICES.NOTIFICATIONS,
      `
      query NotifsByDest($destinataireId: String!) {
        notificationsByDestinataire(destinataireId: $destinataireId) {
          id titre message lue type createdAt
        }
      }
    `,
      { destinataireId },
    );
    return data.notificationsByDestinataire;
  }

  @Query(() => Int)
  @UseGuards(GqlAuthGuard)
  async nombreNonLues(
    @Args('destinataireId') destinataireId: string,
  ): Promise<number> {
    const data = await callService(
      SERVICES.NOTIFICATIONS,
      `
      query NombreNonLues($destinataireId: String!) {
        nombreNonLues(destinataireId: $destinataireId)
      }
    `,
      { destinataireId },
    );
    return data.nombreNonLues;
  }

  @Mutation(() => NotificationType)
  @UseGuards(GqlAuthGuard)
  async envoyerNotification(
    @Args('input') input: CreateNotificationInput,
  ): Promise<NotificationType> {
    const data = await callService(
      SERVICES.NOTIFICATIONS,
      `
      mutation EnvoyerNotif($input: CreateNotificationInput!) {
        envoyerNotification(input: $input) { id titre message lue type createdAt }
      }
    `,
      { input },
    );
    return data.envoyerNotification;
  }

  @Mutation(() => NotificationType)
  @UseGuards(GqlAuthGuard)
  async marquerNotificationLue(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<NotificationType> {
    const data = await callService(
      SERVICES.NOTIFICATIONS,
      `
      mutation MarquerLue($id: ID!) {
        marquerNotificationLue(id: $id) { id titre lue }
      }
    `,
      { id },
    );
    return data.marquerNotificationLue;
  }
}
