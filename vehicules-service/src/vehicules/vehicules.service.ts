import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { GpsPosition } from './entities/gps-position.entity';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { GpsInput } from './dto/gps.input';

@Injectable()
export class VehiculesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepo: Repository<Vehicle>,
    @InjectRepository(GpsPosition)
    private gpsRepo: Repository<GpsPosition>,
  ) {}

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepo.find();
  }

  async findOne(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepo.findOne({ where: { id } });
    if (!vehicle) throw new NotFoundException(`Véhicule ${id} introuvable`);
    return vehicle;
  }

  async create(input: CreateVehicleInput): Promise<Vehicle> {
    // ← Vérification immatriculation unique
    const existing = await this.vehicleRepo.findOne({
      where: { immatriculation: input.immatriculation }
    });
    if (existing) {
      throw new ConflictException(
        `Un véhicule avec l'immatriculation "${input.immatriculation}" existe déjà`
      );
    }
    const vehicle = this.vehicleRepo.create(input);
    return this.vehicleRepo.save(vehicle);
  }

  async addGpsPosition(vehicleId: string, input: GpsInput): Promise<GpsPosition> {
    const vehicle = await this.findOne(vehicleId);
    const position = this.gpsRepo.create({ ...input, vehicleId: vehicle.id });
    return this.gpsRepo.save(position);
  }

  async getHistorique(vehicleId: string): Promise<GpsPosition[]> {
    return this.gpsRepo.find({
      where: { vehicleId },
      order: { timestamp: 'DESC' },
    });
  }
}