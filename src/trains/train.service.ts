import { Injectable } from '@nestjs/common';
import { DatabaseError } from 'sequelize';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize';
import { StationDTO } from 'src/dtos/station.dto';
import { TrainDTO } from 'src/dtos/train.dto';
import { Train } from './train.model';

@Injectable()
export class TrainService {
  constructor(private sequelize: Sequelize) {}
  async getTrainById(trainId: string) {
    try {
      const train = await this.sequelize.query(
        `SP_GetTrainById @trainId=:trainId`,
        {
          type: QueryTypes.SELECT,
          replacements: { trainId },
          mapToModel: true,
          model: Train,
        },
      );
      return train[0];
    } catch (error) {
      throw DatabaseError;
    }
  }
  async getTrainByPartner(partnerId: string) {
    try {
      const train = await this.sequelize.query(
        `SP_GetTrainByPartner @partnerId=:partnerId`,
        {
          type: QueryTypes.SELECT,
          replacements: { partnerId },
          mapToModel: true,
          model: Train,
        },
      );
      return train[0];
    } catch (error) {
      throw DatabaseError;
    }
  }

  async getTrainsByStation(stationDTO: StationDTO) {
    try {
      const trains = await this.sequelize.query(
        `SP_GetTrainsByStation @district=:district, @city=:city, @country=:country`,
        {
          replacements: {
            district: stationDTO.district,
            city: stationDTO.city,
            country: stationDTO.country,
          },
          type: QueryTypes.SELECT,
          mapToModel: true,
          model: Train,
        },
      );
      return trains;
    } catch (error) {
      throw DatabaseError;
    }
  }

  async registerTrain(trainDTO: TrainDTO) {
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
      throw DatabaseError;
    }
  }
}
