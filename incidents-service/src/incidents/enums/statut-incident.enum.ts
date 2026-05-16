import { registerEnumType } from '@nestjs/graphql';

export enum StatutIncident {
  SIGNALE = 'SIGNALE',
  EN_COURS = 'EN_COURS',
  RESOLU = 'RESOLU',
}

registerEnumType(StatutIncident, {
  name: 'StatutIncident',
});