import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Query(() => [Notification])
  async notifications(): Promise<Notification[]> {
    return this.notificationsService.findAll();
  }

  @Query(() => [Notification])
  async notificationsByDestinataire(
    @Args('destinataireId') destinataireId: string,
  ): Promise<Notification[]> {
    return this.notificationsService.findByDestinataire(destinataireId);
  }

  @Query(() => [Notification])
  async notificationsNonLues(
    @Args('destinataireId') destinataireId: string,
  ): Promise<Notification[]> {
    return this.notificationsService.findNonLues(destinataireId);
  }

  @Query(() => Notification)
  async notification(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Notification> {
    return this.notificationsService.findOne(id);
  }

  @Query(() => Int)
  async nombreNonLues(
    @Args('destinataireId') destinataireId: string,
  ): Promise<number> {
    return this.notificationsService.compterNonLues(destinataireId);
  }

  @Mutation(() => Notification)
  async envoyerNotification(
    @Args('input') input: CreateNotificationInput,
  ): Promise<Notification> {
    return this.notificationsService.envoyer(input);
  }

  @Mutation(() => Notification)
  async marquerNotificationLue(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Notification> {
    return this.notificationsService.marquerLue(id);
  }

  @Mutation(() => Boolean)
  async marquerToutesLues(
    @Args('destinataireId') destinataireId: string,
  ): Promise<boolean> {
    return this.notificationsService.marquerToutesLues(destinataireId);
  }
}