import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Item {
  
  @PrimaryGeneratedColumn('uuid')
  @Field( () => ID )
  id: string;

  @Column()
  @Field( () => String)
  name: string;

  @Column()
  @Field( () => Float)
  quantity: number;

  @Column({ nullable: true })
  @Field( () => String, { nullable: true })
  quantityUnits?: string

  /* @Column()
  @Field( () => String)
  stores: string */
}
