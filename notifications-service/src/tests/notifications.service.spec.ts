import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from '../notifications/notifications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notification } from '../notifications/entities/notification.entity';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let repo: any;

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(n => Promise.resolve({ id: 'n1', ...n })),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    count: jest.fn().mockResolvedValue(5),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: getRepositoryToken(Notification), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    repo = module.get(getRepositoryToken(Notification));
  });

  it('should send a notification', async () => {
    const input = { titre: 'Alerte', message: 'Embouteillage', destinataireId: 'u1' };
    const result = await service.envoyer(input);
    expect(result.lue).toBe(false);
    expect(repo.save).toHaveBeenCalled();
  });

  it('should mark notification as read', async () => {
    const notif = { id: 'n1', lue: false };
    repo.findOne.mockResolvedValue(notif);

    const result = await service.marquerLue('n1');
    expect(result.lue).toBe(true);
    expect(repo.save).toHaveBeenCalled();
  });

  it('should count unread notifications', async () => {
    const count = await service.compterNonLues('u1');
    expect(count).toBe(5);
    expect(repo.count).toHaveBeenCalled();
  });
});
