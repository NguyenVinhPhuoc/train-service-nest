import { Injectable, Logger } from '@nestjs/common';
import { DatabaseError, QueryTypes, Sequelize } from 'sequelize';
import { AddScheduleDTO } from 'src/dtos/add-schedule.dto';
import { ScheduleDetails } from 'src/models/schedule-details.model';
import { Schedule } from 'src/models/schedule.model';

@Injectable()
export class SchedulesService {
  private readonly logger = new Logger('SchedulesService');

  constructor(private sequelize: Sequelize) {}

  async addSchedule(
    addScheduleDTO: AddScheduleDTO,
  ): Promise<ScheduleDetails[]> {
    try {
      const details = await this.sequelize.query(
        'SP_AddSchedule @date=:date, @startTime=:startTime, ' +
          '@endTime=:endTime, @travelTime=:travelTime, @gap=:gap, ' +
          '@numberOfVehicles=:numberOfVehicles, @journeyId=:journeyId',
        {
          type: QueryTypes.SELECT,
          replacements: {
            date: addScheduleDTO.date,
            startTime: addScheduleDTO.startTime,
            endTime: addScheduleDTO.endTime,
            travelTime: addScheduleDTO.travelTime,
            gap: addScheduleDTO.gap,
            numberOfVehicles: addScheduleDTO.numberOfVehicles,
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
}
