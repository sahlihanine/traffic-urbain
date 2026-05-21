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

export const DECLARER_INCIDENT = gql`
  mutation DeclarerIncident($input: CreateIncidentInput!) {
    declarerIncident(input: $input) {
      id
      type
      statut
      description
      createdAt
    }
  }
`;

export const MODIFIER_STATUT = gql`
  mutation ModifierStatut($input: UpdateStatutInput!) {
    modifierStatutIncident(input: $input) {
      id
      type
      statut
      updatedAt
    }
  }
`;