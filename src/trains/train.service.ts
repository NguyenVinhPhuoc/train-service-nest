import { Injectable, Logger } from '@nestjs/common';
import { DatabaseError } from 'sequelize';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize';
import { TrainDTO } from 'src/dtos/train.dto';
import { Train } from '../models/train.model';
import { UpdateTrainDTO } from 'src/dtos/update-train.dto';
import { ScheduleDetails } from 'src/models/schedule-details.model';

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
        `SP_RegisterTrain @name=:name, @photoUrl=:photoUrl, @ticketPrice=:ticketPrice, @classId=:classId, ` +
          `@partnerId=:partnerId`,
        {
          type: QueryTypes.SELECT,
          mapToModel: true,
          model: Train,
          replacements: {
            name: trainDTO.name,
            photoUrl: trainDTO.photoUrl,
            ticketPrice: trainDTO.ticketPrice,
            partnerId: trainDTO.partnerId,
            classId: trainDTO.classId,
          },
          raw: true,
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

  async updateTrainInformation(trainUpdateDTO: UpdateTrainDTO): Promise<Train> {
    try {
      const train = await this.sequelize.query(
        `SP_UpdateTrainInformation @id=:id, @name=:name, @photoUrl=:photoUrl, '+
        '@ticketPrice=:ticketPrice, , @classId=:classId`,
        {
          replacements: {
            id: trainUpdateDTO.vehicleId,
            name: trainUpdateDTO.name,
            photoUrl: trainUpdateDTO.photoUrl,
            ticketPrice: trainUpdateDTO.ticketPrice,
          },
          type: QueryTypes.SELECT,
          mapToModel: true,
          model: Train,
          raw: true,
        },
      );
      return train[0];
    } catch (error) {
      this.logger.error(error.message);
      throw DatabaseError;
    }
  }

  async unregisterTrain(trainId: string) {
    try {
      const train = await this.sequelize.query(
        'SP_UnregisterTrain @trainId=:trainId',
        {
          replacements: {
            trainId: trainId,
            type: QueryTypes.SELECT,
            raw: true,
          },
        },
      );
      return train[0];
    } catch (error) {
      this.logger.error(error.message);
      throw DatabaseError;
    }
  }
}
