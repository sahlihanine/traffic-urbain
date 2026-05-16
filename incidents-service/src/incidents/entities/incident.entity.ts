import {
  Entity, Column, PrimaryGeneratedColumn,
  CreateDateColumn, UpdateDateColumn
} from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { TypeIncident } from '../enums/type-incident.enum';
import { StatutIncident } from '../enums/statut-incident.enum';

@ObjectType()
@Entity('incidents')
export class Incident {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'enum', enum: TypeIncident })
  type: TypeIncident;

  @Field()
  @Column({ type: 'enum', enum: StatutIncident, default: StatutIncident.SIGNALE })
  statut: StatutIncident;

  @Field()
  @Column()
  description: string;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 8 })
  latitude: number;

  @Field(() => Float)
  @Column('decimal', { precision: 11, scale: 8 })
  longitude: number;

  @Field()
  @Column()
  declarePar: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field({ nullable: true })
  @UpdateDateColumn()
  updatedAt: Date;
}