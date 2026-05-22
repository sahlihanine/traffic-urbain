import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './entities/incident.entity';
import { CreateIncidentInput } from './dto/create-incident.input';
import { UpdateStatutInput } from './dto/update-statut.input';
import { StatutIncident } from './enums/statut-incident.enum';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident)
    private incidentRepo: Repository<Incident>,
  ) {}

  async findAll(): Promise<Incident[]> {
    return this.incidentRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Incident> {
    const incident = await this.incidentRepo.findOne({ where: { id } });
    if (!incident) throw new NotFoundException(`Incident ${id} introuvable`);
    return incident;
  }

  async findByStatut(statut: StatutIncident): Promise<Incident[]> {
    return this.incidentRepo.find({
      where: { statut },
      order: { createdAt: 'DESC' },
    });
  }

  async declarer(input: CreateIncidentInput): Promise<Incident> {
    const incident = this.incidentRepo.create({
      ...input,
      statut: StatutIncident.SIGNALE,
    });
    return this.incidentRepo.save(incident);
  }

  async updateStatut(input: UpdateStatutInput): Promise<Incident> {
    const incident = await this.findOne(input.id);
    incident.statut = input.statut;
    return this.incidentRepo.save(incident);
  }
}
