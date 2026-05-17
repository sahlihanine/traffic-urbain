import { gql } from '@apollo/client';

export const GET_INCIDENTS = gql`
  query {
    incidents {
      id
      type
      statut
      description
      latitude
      longitude
      declarePar
      createdAt
    }
  }
`;