import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
  ) {}

  async findAll(): Promise<Notification[]> {
    return this.notificationRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByDestinataire(destinataireId: string): Promise<Notification[]> {
    return this.notificationRepo.find({
      where: { destinataireId },
      order: { createdAt: 'DESC' },
    });
  }

  async findNonLues(destinataireId: string): Promise<Notification[]> {
    return this.notificationRepo.find({
      where: { destinataireId, lue: false },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Notification> {
    const notif = await this.notificationRepo.findOne({ where: { id } });
    if (!notif) throw new NotFoundException(`Notification ${id} introuvable`);
    return notif;
  }

  async envoyer(input: CreateNotificationInput): Promise<Notification> {
    const notif = this.notificationRepo.create({
      ...input,
      lue: false,
    });
    return this.notificationRepo.save(notif);
  }

  async marquerLue(id: string): Promise<Notification> {
    const notif = await this.findOne(id);
    notif.lue = true;
    return this.notificationRepo.save(notif);
  }

  async marquerToutesLues(destinataireId: string): Promise<boolean> {
    await this.notificationRepo.update(
      { destinataireId, lue: false },
      { lue: true },
    );
    return true;
  }

  async compterNonLues(destinataireId: string): Promise<number> {
    return this.notificationRepo.count({
      where: { destinataireId, lue: false },
    });
  }
}