import { Test, TestingModule } from '@nestjs/testing';
import { VehiculesService } from '../vehicules/vehicules.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vehicle } from '../vehicules/entities/vehicle.entity';
import { GpsPosition } from '../vehicules/entities/gps-position.entity';

describe('VehiculesService', () => {
  let service: VehiculesService;
  let vehicleRepo: any;
  let gpsRepo: any;

  const mockVehicleRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((v) => Promise.resolve({ id: 'v1', ...v })),
  };

  const mockGpsRepo = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((g) => Promise.resolve({ id: 'g1', ...g })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiculesService,
        { provide: getRepositoryToken(Vehicle), useValue: mockVehicleRepo },
        { provide: getRepositoryToken(GpsPosition), useValue: mockGpsRepo },
      ],
    }).compile();

    service = module.get<VehiculesService>(VehiculesService);
    vehicleRepo = module.get(getRepositoryToken(Vehicle));
    gpsRepo = module.get(getRepositoryToken(GpsPosition));
  });

  it('should create a vehicle', async () => {
    const input = {
      immatriculation: 'ABC-123',
      marque: 'Toyota',
      modele: 'Corolla',
      type: 'VOITURE',
    };
    const result = await service.create(input);
    expect(result.immatriculation).toBe(input.immatriculation);
    expect(vehicleRepo.save).toHaveBeenCalled();
  });

  it('should add a GPS position', async () => {
    const vehicleId = 'v1';
    vehicleRepo.findOne.mockResolvedValue({ id: vehicleId });
    const input = { latitude: 48.8566, longitude: 2.3522, vitesse: 50 };

    const result = await service.addGpsPosition(vehicleId, input);
    expect(result.vehicleId).toBe(vehicleId);
    expect(gpsRepo.save).toHaveBeenCalled();
  });
});
