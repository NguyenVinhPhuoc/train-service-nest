import { Injectable, Logger } from '@nestjs/common';
import { DatabaseError, QueryTypes, Sequelize } from 'sequelize';
import { AddScheduleDTO } from 'src/dtos/add-schedule.dto';
import { BookTrainDto } from 'src/dtos/create-book.dtos';
import { GetSchedulesByConditionsDTO } from 'src/dtos/get-schedules-by-conds.dto';
import { FilteredSchedule } from 'src/models/filtered-schedule.model';
import { ScheduleDetails } from 'src/models/schedule-details.model';
import { Schedule } from 'src/models/schedule.model';

@Injectable()
export class SchedulesService {
  private readonly logger = new Logger('SchedulesService');

  constructor(private sequelize: Sequelize) {}

  async getScheduleByJourneyAndDate(
    journeyId: string,
    date: string,
  ): Promise<Schedule> {
    try {
      const schedules = await this.sequelize.query(
        'SP_GetScheduleByJourneyAndDate @journeyId=:journeyId, @date=:date',
        {
          type: QueryTypes.SELECT,
          replacements: { journeyId, date },
          raw: true,
          mapToModel: true,
          model: Schedule,
        },
      );
      console.log(schedules[0]);

      return schedules[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async addSchedule(
    addScheduleDTO: AddScheduleDTO,
  ): Promise<ScheduleDetails[]> {
    try {
      const details = await this.sequelize.query(
        'SP_AddSchedule @date=:date, @startTime=:startTime, ' +
          '@endTime=:endTime, @gap=:gap, ' +
          '@journeyId=:journeyId',
        {
          type: QueryTypes.SELECT,
          replacements: {
            date: addScheduleDTO.date,
            startTime: addScheduleDTO.startTime,
            endTime: addScheduleDTO.endTime,
            gap: addScheduleDTO.gap,
            journeyId: addScheduleDTO.journeyId,
          },
          raw: true,
          mapToModel: true,
          model: ScheduleDetails,
        },
      );
      return details;
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async getScheduleById(scheduleId: string): Promise<Schedule> {
    try {
      const schedule = await this.sequelize.query(
        'SP_GetScheduleById @scheduleId=:scheduleId',
        {
          type: QueryTypes.SELECT,
          replacements: { scheduleId },
          raw: true,
          mapToModel: true,
          model: Schedule,
        },
      );
      return schedule[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async getSchedulesByConditions(
    getSchedulesByConditionsDTO: GetSchedulesByConditionsDTO,
  ): Promise<FilteredSchedule[]> {
    try {
      const schedules = await this.sequelize.query(
        'SP_GetSchedulesByConditions @depDistrict=:depDistrict, @depCity=:depCity, ' +
          '@depCountry=:depCountry, @desDistrict=:desDistrict, ' +
          '@desCity=:desCity, @desCountry=:desCountry, @date=:date, ' +
          '@pickUpTime=:pickUpTime',
        {
          type: QueryTypes.SELECT,
          replacements: {
            ...getSchedulesByConditionsDTO,
          },
          raw: true,
          mapToModel: true,
          model: FilteredSchedule,
        },
      );
      return schedules;
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async getScheduleDetailsBySchedule(scheduleId: string) {
    try {
      const scheduleDetails = await this.sequelize.query(
        'SP_GetScheduleDetailsBySchedule @scheduleId=:scheduleId',
        {
          type: QueryTypes.SELECT,
          replacements: { scheduleId },
          raw: true,
          mapToModel: true,
          model: ScheduleDetails,
        },
      );
      return scheduleDetails;
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async bookTrain(bookTrainDto: BookTrainDto) {
    try {
      const isBookable = await this.sequelize.query(
        'SP_BookTrain @scheduleDetailId=:scheduleDetailId, @numberOfTickets=:numberOfTickets',
        {
          type: QueryTypes.SELECT,
          replacements: {
            scheduleDetailId: bookTrainDto.scheduleDetailId,
            numberOfTickets: bookTrainDto.numberOfTickets,
            raw: true,
          },
        },
      );
      return isBookable;
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async cancelBook(bookTrainDto: BookTrainDto) {
    try {
      const cancelBook = await this.sequelize.query(
        'SP_RevokeTickets @scheduleDetailId=:scheduleDetailId, @numberOfTickets=:numberOfTickets',
        {
          type: QueryTypes.SELECT,
          replacements: {
            scheduleDetailId: bookTrainDto.scheduleDetailId,
            numberOfTickets: bookTrainDto.numberOfTickets,
            raw: true,
          },
        },
      );
      return cancelBook;
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async manipulateScheduleDetails(
    scheduleDetailId: string,
    type: string,
  ): Promise<ScheduleDetails> {
    try {
      const scheduleDetails = await this.sequelize.query(
        `SP_${type}ScheduleDetail @scheduleDetailId=:scheduleDetailId`,
        {
          type: QueryTypes.SELECT,
          replacements: { scheduleDetailId },
          raw: true,
          mapToModel: true,
          model: ScheduleDetails,
        },
      );
      return scheduleDetails[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async cancelScheduleDetail(
    scheduleDetailId: string,
  ): Promise<ScheduleDetails> {
    try {
      const detail = await this.sequelize.query(
        'SP_CancelScheduleDetail @scheduleDetailId=:scheduleDetailId',
        {
          type: QueryTypes.SELECT,
          replacements: { scheduleDetailId },
          raw: true,
          mapToModel: true,
          model: ScheduleDetails,
        },
      );
      return detail[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }
  async revokeTickets(
    scheduleDetailId: string,
    numberOfTickets: number,
  ): Promise<boolean> {
    try {
      const result = await this.sequelize.query(
        'SP_RevokeTickets @scheduleDetailId=:scheduleDetailId, ' +
          '@numberOfTickets=:numberOfTickets',
        {
          type: QueryTypes.UPDATE,
          replacements: { scheduleDetailId, numberOfTickets },
        },
      );
      return result[1] === 2;
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }
}
