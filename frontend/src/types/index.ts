export interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  immatriculation: string;
  marque: string;
  modele: string;
  type: string;
  actif: boolean;
}

export interface GpsPosition {
  id: string;
  latitude: number;
  longitude: number;
  vitesse: number;
  timestamp: string;
  vehicleId: string;
}

export interface TrafficZone {
  id: string;
  nom: string;
  latMin: number;
  latMax: number;
  lonMin: number;
  lonMax: number;
  nombreVehicules: number;
  niveauTrafic: string;
}

export interface Incident {
  id: string;
  type: string;
  statut: string;
  description: string;
  latitude: number;
  longitude: number;
  declarePar: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  titre: string;
  message: string;
  destinataireId: string;
  lue: boolean;
  type: string;
  createdAt: string;
}