import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GpsPosition } from './gps-position.entity';

@ObjectType()
@Entity('vehicles')
export class Vehicle {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  immatriculation: string;

  @Field()
  @Column()
  marque: string;

  @Field()
  @Column()
  modele: string;

  @Field()
  @Column()
  type: string; // VOITURE | CAMION | MOTO | BUS

  @Field()
  @Column({ default: true })
  actif: boolean;

  @Field(() => [GpsPosition], { nullable: true })
  @OneToMany(() => GpsPosition, (g) => g.vehicle)
  positions: GpsPosition[];
}