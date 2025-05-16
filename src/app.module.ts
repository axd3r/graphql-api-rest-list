import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { ItemsModule } from './items/items.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),

    GraphQLModule.forRootAsync({
    driver: ApolloDriver,
    imports: [AuthModule],
    inject: [JwtService],
    useFactory: async( jwtService: JwtService ) => ({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault()
      ],
      
      context({ req }) {
        /* 
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) throw Error('token needed');

        const payload = jwtService.decode( token );
        if (!payload) throw Error('Token not valid');
         */
      }
    })     
  }), 
  TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true
  }),
  ItemsModule,
  UsersModule,
  AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
