import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { text } from 'stream/consumers';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'users'})
@ObjectType()
export class User {
  
  @PrimaryGeneratedColumn('uuid')
  @Field( () => ID)
  id: string;

  @Field( () => String)
  @Column()
  fullName: string;

  @Field( () => String)
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field( () => [String])
  @Column({ 
    type: 'text',
    array: true,
    default: ['user']
  })
  roles: string[];

  @Field( () => Boolean)
  @Column({ 
    type: 'boolean',
    default: true
  })
  isActive: boolean;
}
