import { gql } from '@apollo/client';

export const GET_ZONES = gql`
  query {
    zones {
      id
      nom
      niveauTrafic
      nombreVehicules
      latMin
      latMax
      lonMin
      lonMax
    }
  }
`;

export const GET_ZONES_CONGESTIONNEES = gql`
  query {
    zonesCongestionnees {
      id
      nom
      niveauTrafic
      nombreVehicules
      latMin
      latMax
      lonMin
      lonMax
    }
  }
`;

export const CREER_ZONE = gql`
  mutation CreerZone($input: CreateZoneInput!) {
    creerZone(input: $input) {
      id
      nom
      niveauTrafic
      nombreVehicules
    }
  }
`;

export const UPDATE_DENSITE = gql`
  mutation UpdateDensite($input: UpdateDensiteInput!) {
    updateDensite(input: $input) {
      id
      nom
      niveauTrafic
      nombreVehicules
    }
  }
`;