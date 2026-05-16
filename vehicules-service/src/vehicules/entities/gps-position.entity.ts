import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Vehicle } from './vehicle.entity';

@ObjectType()
@Entity('gps_positions')
export class GpsPosition {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 8 })
  latitude: number;

  @Field(() => Float)
  @Column('decimal', { precision: 11, scale: 8 })
  longitude: number;

  @Field(() => Float, { nullable: true })
  @Column({ nullable: true, type: 'decimal' })
  vitesse: number;

  @Field()
  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => Vehicle, (v) => v.positions)
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;

  @Field()
  @Column()
  vehicleId: string;
}