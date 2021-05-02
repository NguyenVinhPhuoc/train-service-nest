import { Injectable, Logger } from '@nestjs/common';
import { DatabaseError } from 'sequelize';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize';
import { RegisterStationDTO } from 'src/dtos/station.dto';
import { TrainDTO } from 'src/dtos/train.dto';
import { Train } from '../models/train.model';

@Injectable()
export class TrainService {
  private readonly logger = new Logger('TrainsService');

  constructor(private sequelize: Sequelize) {}

  async getTrainsByPartner(partnerId: string) {
    try {
      const trains = await this.sequelize.query(
        `SP_GetTrainsByPartner @partnerId=:partnerId`,
        {
          type: QueryTypes.SELECT,
          replacements: { partnerId },
          mapToModel: true,
          model: Train,
          raw: true,
        },
      );
      return trains;
    } catch (error) {
      this.logger.error(error.message);
      throw DatabaseError;
    }
  }

  async registerTrain(trainDTO: TrainDTO): Promise<Train> {
    try {
      const train = await this.sequelize.query(
        `SP_RegisterTrain @name=:name, @photoUrl=:photoUrl, @ticketPrice=:ticketPrice, @partnerId=:partnerId`,
        {
          type: QueryTypes.SELECT,
          mapToModel: true,
          model: Train,
          replacements: {
            name: trainDTO.name,
            photoUrl: trainDTO.photoUrl,
            ticketPrice: trainDTO.ticketPrice,
            partnerId: trainDTO.partnerId,
          },
        },
      );
      return train[0];
    } catch (error) {
      this.logger.error(error.message);
      throw DatabaseError;
    }
  }

  async getTrainByJourney(journeyId: string): Promise<Train> {
    try {
      const train = await this.sequelize.query(
        'SP_GetTrainByJourney @journeyId=:journeyId',
        {
          type: QueryTypes.SELECT,
          replacements: { journeyId },
          raw: true,
          mapToModel: true,
          model: Train,
        },
      );
      return train[0];
    } catch (error) {
      throw new DatabaseError(error);
    }
  }
}
