import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ClientesModule } from './clientes/clientes.module';
import { VehiculosModule } from './vehiculos/vehiculos.module';
import { OrdenesModule } from './ordenes/ordenes.module';
import { ReportesModule } from './reportes/reportes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // solo en desarrollo: crea/ajusta las tablas a partir de las entidades
        logging: config.get('DB_LOGGING') === 'true',
      }),
    }),
    AuthModule,
    ClientesModule,
    VehiculosModule,
    OrdenesModule,
    ReportesModule,
  ],
})
export class AppModule {}
