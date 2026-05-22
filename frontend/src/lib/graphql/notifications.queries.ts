import { gql } from '@apollo/client';

export const GET_NOTIFICATIONS = gql`
  query NotifsByDest($destinataireId: String!) {
    notificationsByDestinataire(destinataireId: $destinataireId) {
      id
      titre
      message
      lue
      type
      createdAt
    }
  }
`;

export const ENVOYER_NOTIFICATION = gql`
  mutation EnvoyerNotification($input: CreateNotificationInput!) {
    envoyerNotification(input: $input) {
      id
      titre
      message
      lue
      type
      createdAt
    }
  }
`;

export const MARQUER_LUE = gql`
  mutation MarquerLue($id: ID!) {
    marquerNotificationLue(id: $id) {
      id
      titre
      lue
    }
  }
`;

export const MARQUER_TOUTES_LUES = gql`
  mutation MarquerToutesLues($destinataireId: String!) {
    marquerToutesLues(destinataireId: $destinataireId)
  }
`;