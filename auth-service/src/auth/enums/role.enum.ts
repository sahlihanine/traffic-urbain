import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'Rôles disponibles dans le système',
});