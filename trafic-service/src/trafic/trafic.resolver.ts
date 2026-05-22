import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TraficService } from './trafic.service';
import { TrafficZone } from './entities/traffic-zone.entity';
import { CreateZoneInput } from './dto/create-zone.input';
import { UpdateDensiteInput } from './dto/update-densite.input';

@Resolver(() => TrafficZone)
export class TraficResolver {
  constructor(private readonly traficService: TraficService) {}

  @Query(() => [TrafficZone])
  async zones(): Promise<TrafficZone[]> {
    return this.traficService.findAll();
  }

  @Query(() => TrafficZone)
  async zone(@Args('id', { type: () => ID }) id: string): Promise<TrafficZone> {
    return this.traficService.findOne(id);
  }

  @Query(() => [TrafficZone])
  async zonesCongestionnees(): Promise<TrafficZone[]> {
    return this.traficService.getZonesCongestionnees();
  }

  @Query(() => [TrafficZone])
  async zonesByNiveau(@Args('niveau') niveau: string): Promise<TrafficZone[]> {
    return this.traficService.getZonesByNiveau(niveau);
  }

  @Mutation(() => TrafficZone)
  async creerZone(@Args('input') input: CreateZoneInput): Promise<TrafficZone> {
    return this.traficService.creerZone(input);
  }

  @Mutation(() => TrafficZone)
  async updateDensite(
    @Args('input') input: UpdateDensiteInput,
  ): Promise<TrafficZone> {
    return this.traficService.updateDensite(input);
  }
}
