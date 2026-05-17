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

export const CREATE_VEHICLE = gql`
  mutation CreateVehicle($input: CreateVehicleInput!) {
    createVehicle(input: $input) {
      id
      immatriculation
      marque
      modele
      type
      actif
    }
  }
`;

export const ADD_GPS_POSITION = gql`
  mutation AddGpsPosition($vehicleId: ID!, $input: GpsInput!) {
    addGpsPosition(vehicleId: $vehicleId, input: $input) {
      id
      latitude
      longitude
      vitesse
      timestamp
      vehicleId
    }
  }
`;