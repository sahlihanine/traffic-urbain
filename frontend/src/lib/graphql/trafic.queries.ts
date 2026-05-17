import { gql } from '@apollo/client';

export const GET_ZONES = gql`
  query {
    zones {
      id
      nom
      niveauTrafic
      nombreVehicules
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
    }
  }
`;