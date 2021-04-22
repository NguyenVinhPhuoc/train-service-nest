import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrainModule } from './trains/train.module';
import { HealthController } from './health/health.controller';
import { HealthModule } from './health/health.module';
import { JourneysModule } from './journeys/journeys.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mssql',
      host:
        'traveloka-microservices.cwvwmifx3zgp.ap-southeast-1.rds.amazonaws.com',
      port: 1433,
      username: 'admin',
      password: '!admin123',
      database: 'Train_Service_DB',
    }),
    HealthModule,
    TrainModule,
    JourneysModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
