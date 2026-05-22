import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { AuthGatewayResolver } from './resolvers/auth.resolver';
import { VehiculesGatewayResolver } from './resolvers/vehicules.resolver';
import { TraficGatewayResolver } from './resolvers/trafic.resolver';
import { IncidentsGatewayResolver } from './resolvers/incidents.resolver';
import { NotificationsGatewayResolver } from './resolvers/notifications.resolver';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super_secret_key_123',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [
    JwtStrategy,
    GqlAuthGuard,
    AuthGatewayResolver,
    VehiculesGatewayResolver,
    TraficGatewayResolver,
    IncidentsGatewayResolver,
    NotificationsGatewayResolver,
  ],
})
export class GatewayModule {}
