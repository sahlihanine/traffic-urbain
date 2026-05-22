import { registerEnumType } from '@nestjs/graphql';

export enum TypeIncident {
  ACCIDENT = 'ACCIDENT',
  TRAVAUX = 'TRAVAUX',
  ROUTE_FERMEE = 'ROUTE_FERMEE',
  EMBOUTEILLAGE = 'EMBOUTEILLAGE',
}

registerEnumType(TypeIncident, {
  name: 'TypeIncident',
});
