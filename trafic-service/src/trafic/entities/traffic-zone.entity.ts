import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
@Entity('traffic_zones')
export class TrafficZone {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nom: string;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 8 })
  latMin: number;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 8 })
  latMax: number;

  @Field(() => Float)
  @Column('decimal', { precision: 11, scale: 8 })
  lonMin: number;

  @Field(() => Float)
  @Column('decimal', { precision: 11, scale: 8 })
  lonMax: number;

  @Field(() => Int)
  @Column({ default: 0 })
  nombreVehicules: number;

  @Field()
  @Column({ default: 'FAIBLE' })
  niveauTrafic: string; // FAIBLE | MOYEN | ELEVE

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}