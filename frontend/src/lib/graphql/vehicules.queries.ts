import { gql } from '@apollo/client';

export const GET_VEHICLES = gql`
  query {
    vehicles {
      id
      immatriculation
      marque
      modele
      type
      actif
    }
  }
`;