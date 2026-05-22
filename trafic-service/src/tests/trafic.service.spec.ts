import { Test, TestingModule } from '@nestjs/testing';
import { TraficService } from '../trafic/trafic.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TrafficZone } from '../trafic/entities/traffic-zone.entity';

describe('TraficService', () => {
  let service: TraficService;
  let repo: any;

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((zone) => Promise.resolve({ id: '1', ...zone })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TraficService,
        { provide: getRepositoryToken(TrafficZone), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<TraficService>(TraficService);
    repo = module.get(getRepositoryToken(TrafficZone));
  });

  it('should update traffic density and classify it', async () => {
    const zone = {
      id: '1',
      nom: 'Zone 1',
      nombreVehicules: 0,
      niveauTrafic: 'FAIBLE',
    };
    repo.findOne.mockResolvedValue(zone);

    // Test FAIBLE
    let result = await service.updateDensite({
      zoneId: '1',
      nombreVehicules: 5,
    });
    expect(result.niveauTrafic).toBe('FAIBLE');

    // Test MOYEN
    result = await service.updateDensite({ zoneId: '1', nombreVehicules: 15 });
    expect(result.niveauTrafic).toBe('MOYEN');

    // Test ELEVE
    result = await service.updateDensite({ zoneId: '1', nombreVehicules: 40 });
    expect(result.niveauTrafic).toBe('ELEVE');
  });

  it('should check if coordinates are within zone', () => {
    const zone = { latMin: 10, latMax: 20, lonMin: 30, lonMax: 40 } as any;

    expect(service.estDansZone(15, 35, zone)).toBe(true);
    expect(service.estDansZone(5, 35, zone)).toBe(false);
    expect(service.estDansZone(15, 45, zone)).toBe(false);
  });
});
