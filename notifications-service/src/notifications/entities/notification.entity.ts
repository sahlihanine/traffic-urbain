import {
  Entity, Column, PrimaryGeneratedColumn,
  CreateDateColumn
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('notifications')
export class Notification {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  titre: string;

  @Field()
  @Column('text')
  message: string;

  @Field()
  @Column()
  destinataireId: string;

  @Field()
  @Column({ default: false })
  lue: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  type: string; // INCIDENT | TRAFIC | SYSTEME

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}