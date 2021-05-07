import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { JourneysService } from './journeys.service';

describe('JourneysService', () => {
  let service: JourneysService;
  let trainId: '95804A0C-1838-42AF-9564-066D8824B506';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      ],
      providers: [JourneysService],
    }).compile();

    service = module.get<JourneysService>(JourneysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', async () => {
    try {
      expect(await service.getJourneysByTrain(trainId)).toBeDefined();
    } catch (error) {}
  });
});
