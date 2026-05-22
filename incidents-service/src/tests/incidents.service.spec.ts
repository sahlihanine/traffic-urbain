import { Test, TestingModule } from '@nestjs/testing';
import { IncidentsService } from '../incidents/incidents.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Incident } from '../incidents/entities/incident.entity';
import { StatutIncident } from '../incidents/enums/statut-incident.enum';
import { TypeIncident } from '../incidents/enums/type-incident.enum';

describe('IncidentsService', () => {
  let service: IncidentsService;
  let repo: any;

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((i) => Promise.resolve({ id: 'i1', ...i })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidentsService,
        { provide: getRepositoryToken(Incident), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<IncidentsService>(IncidentsService);
    repo = module.get(getRepositoryToken(Incident));
  });

  it('should declare an incident', async () => {
    const input = {
      type: TypeIncident.ACCIDENT,
      description: 'Accident grave',
      latitude: 48.8,
      longitude: 2.3,
    };
    const result = await service.declarer(input);
    expect(result.statut).toBe(StatutIncident.SIGNALE);
    expect(repo.save).toHaveBeenCalled();
  });

  it('should update incident status', async () => {
    const incident = { id: 'i1', statut: StatutIncident.SIGNALE };
    repo.findOne.mockResolvedValue(incident);

    const result = await service.updateStatut({
      id: 'i1',
      statut: StatutIncident.RESOLU,
    });
    expect(result.statut).toBe(StatutIncident.RESOLU);
    expect(repo.save).toHaveBeenCalled();
  });
});
