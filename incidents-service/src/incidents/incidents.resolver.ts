import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { IncidentsService } from './incidents.service';
import { Incident } from './entities/incident.entity';
import { CreateIncidentInput } from './dto/create-incident.input';
import { UpdateStatutInput } from './dto/update-statut.input';
import { StatutIncident } from './enums/statut-incident.enum';

@Resolver(() => Incident)
export class IncidentsResolver {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Query(() => [Incident])
  async incidents(): Promise<Incident[]> {
    return this.incidentsService.findAll();
  }

  @Query(() => Incident)
  async incident(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Incident> {
    return this.incidentsService.findOne(id);
  }

  @Query(() => [Incident])
  async incidentsByStatut(
    @Args('statut', { type: () => StatutIncident }) statut: StatutIncident,
  ): Promise<Incident[]> {
    return this.incidentsService.findByStatut(statut);
  }

  @Mutation(() => Incident)
  async declarerIncident(
    @Args('input') input: CreateIncidentInput,
  ): Promise<Incident> {
    return this.incidentsService.declarer(input);
  }

  @Mutation(() => Incident)
  async modifierStatutIncident(
    @Args('input') input: UpdateStatutInput,
  ): Promise<Incident> {
    return this.incidentsService.updateStatut(input);
  }
}
