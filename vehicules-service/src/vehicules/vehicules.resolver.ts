import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  ID,
} from '@nestjs/graphql';
import { VehiculesService } from './vehicules.service';
import { Vehicle } from './entities/vehicle.entity';
import { GpsPosition } from './entities/gps-position.entity';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { GpsInput } from './dto/gps.input';

@Resolver(() => Vehicle)
export class VehiculesResolver {
  constructor(private readonly vehiculesService: VehiculesService) {}

  @Query(() => [Vehicle])
  async vehicles(): Promise<Vehicle[]> {
    return this.vehiculesService.findAll();
  }

  @Query(() => Vehicle)
  async vehicle(@Args('id', { type: () => ID }) id: string): Promise<Vehicle> {
    return this.vehiculesService.findOne(id);
  }

  @Mutation(() => Vehicle)
  async createVehicle(
    @Args('input') input: CreateVehicleInput,
  ): Promise<Vehicle> {
    return this.vehiculesService.create(input);
  }

  @Mutation(() => GpsPosition)
  async addGpsPosition(
    @Args('vehicleId', { type: () => ID }) vehicleId: string,
    @Args('input') input: GpsInput,
  ): Promise<GpsPosition> {
    return this.vehiculesService.addGpsPosition(vehicleId, input);
  }

  @ResolveField(() => [GpsPosition])
  async positions(@Parent() vehicle: Vehicle): Promise<GpsPosition[]> {
    return this.vehiculesService.getHistorique(vehicle.id);
  }
}
