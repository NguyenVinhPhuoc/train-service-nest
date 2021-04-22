import { Injectable } from '@nestjs/common';
import { Sequelize, QueryTypes, DatabaseError } from 'sequelize';
import { Journey } from './journey.model';

@Injectable()
export class JourneysService {
  constructor(private sequelize: Sequelize) {}

  async getJourneysByBus(trainId: string) {
    try {
      const journeys = await this.sequelize.query(
        'SP_GetJourneysByBus @trainId=:trainId',
        {
          type: QueryTypes.SELECT,
          replacements: { trainId },
          mapToModel: true,
          model: Journey,
        },
      );
      return journeys;
    } catch (error) {
      throw DatabaseError;
    }
  }

  async registerJourney(trainId: string) {
    try {
      const journey = await this.sequelize.query(
        'SP_RegisterJourney @trainId=:trainId',
        {
          type: QueryTypes.SELECT,
          replacements: { trainId },
          mapToModel: true,
          model: Journey,
        },
      );
      return journey[0];
    } catch (error) {
      throw DatabaseError;
    }
  }

  async activateJourney(journeyId: string) {
    try {
      const result = await this.sequelize.query(
        'SP_ActivateJourney @journeyId=:journeyId',
        {
          type: QueryTypes.UPDATE,
          replacements: { journeyId },
        },
      );
      return !!result[1];
    } catch (error) {
      throw DatabaseError;
    }
  }
}
