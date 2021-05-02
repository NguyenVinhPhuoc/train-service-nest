import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TrainModule } from './trains/train.module';
import { HealthModule } from './health/health.module';
import { JourneysModule } from './journeys/journeys.module';
import { TrainController } from './trains/train.controller';
import { TrainService } from './trains/train.service';
import { SchedulesModule } from './schedules/schedules.module';
import { SchedulesService } from './schedules/schedules.service';
import { JourneysService } from './journeys/journeys.service';

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
    SchedulesModule,
  ],
  controllers: [TrainController],
  providers: [TrainService, SchedulesService, JourneysService],
})
export class AppModule {}
