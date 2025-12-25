import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentModule } from './modules/content/content.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        synchronize: false, // Use migrations instead
        migrationsRun: true, // Auto run migrations on startup
        logging: configService.get('NODE_ENV') === 'development',
        ssl: configService.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
      }),
      inject: [ConfigService],
    }),

    // Feature modules
    ContentModule,
  ],
})
export class AppModule {}
