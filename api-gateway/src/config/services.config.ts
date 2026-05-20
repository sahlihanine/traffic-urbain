export const SERVICES = {
  AUTH: process.env.AUTH_SERVICE_URL || 'http://localhost:3001/graphql',
  VEHICULES: process.env.VEHICULES_SERVICE_URL || 'http://localhost:3002/graphql',
  TRAFIC: process.env.TRAFIC_SERVICE_URL || 'http://localhost:3003/graphql',
  INCIDENTS: process.env.INCIDENTS_SERVICE_URL || 'http://localhost:3004/graphql',
  NOTIFICATIONS: process.env.NOTIFICATIONS_SERVICE_URL || 'http://localhost:3005/graphql',
};
