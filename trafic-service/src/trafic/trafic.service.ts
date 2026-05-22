import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrafficZone } from './entities/traffic-zone.entity';
import { CreateZoneInput } from './dto/create-zone.input';
import { UpdateDensiteInput } from './dto/update-densite.input';

@Injectable()
export class TraficService {
  constructor(
    @InjectRepository(TrafficZone)
    private zoneRepo: Repository<TrafficZone>,
  ) {}

  async findAll(): Promise<TrafficZone[]> {
    return this.zoneRepo.find();
  }

  async findOne(id: string): Promise<TrafficZone> {
    const zone = await this.zoneRepo.findOne({ where: { id } });
    if (!zone) throw new NotFoundException(`Zone ${id} introuvable`);
    return zone;
  }

  async creerZone(input: CreateZoneInput): Promise<TrafficZone> {
    const zone = this.zoneRepo.create(input);
    return this.zoneRepo.save(zone);
  }

  async updateDensite(input: UpdateDensiteInput): Promise<TrafficZone> {
    const zone = await this.findOne(input.zoneId);
    zone.nombreVehicules = input.nombreVehicules;

    // Classification automatique
    if (input.nombreVehicules < 10) {
      zone.niveauTrafic = 'FAIBLE';
    } else if (input.nombreVehicules < 30) {
      zone.niveauTrafic = 'MOYEN';
    } else {
      zone.niveauTrafic = 'ELEVE';
    }

    return this.zoneRepo.save(zone);
  }

  async getZonesCongestionnees(): Promise<TrafficZone[]> {
    return this.zoneRepo.find({
      where: { niveauTrafic: 'ELEVE' },
    });
  }

  async getZonesByNiveau(niveau: string): Promise<TrafficZone[]> {
    return this.zoneRepo.find({
      where: { niveauTrafic: niveau.toUpperCase() },
    });
  }

  // Vérifie si coordonnées GPS sont dans une zone
  estDansZone(latitude: number, longitude: number, zone: TrafficZone): boolean {
    return (
      latitude >= zone.latMin &&
      latitude <= zone.latMax &&
      longitude >= zone.lonMin &&
      longitude <= zone.lonMax
    );
  }
}
