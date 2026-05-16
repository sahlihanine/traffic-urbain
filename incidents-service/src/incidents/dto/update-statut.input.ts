import { InputType, Field, ID } from '@nestjs/graphql';
import { StatutIncident } from '../enums/statut-incident.enum';

@InputType()
export class UpdateStatutInput {
  @Field(() => ID)
  id: string;

  @Field(() => StatutIncident)
  statut: StatutIncident;
}