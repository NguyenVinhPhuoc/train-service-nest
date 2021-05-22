import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
} from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AddScheduleDTO } from 'src/dtos/add-schedule.dto';
import { BookTrainDto } from 'src/dtos/create-book.dtos';
import { GetSchedulesByConditionsDTO } from 'src/dtos/get-schedules-by-conds.dto';
import { Schedule } from 'src/models/schedule.model';
import { SchedulesService } from './schedules.service';

@Controller('schedules')
export class SchedulesController {
  private readonly logger = new Logger('SchedulesController');

  constructor(private schedulesService: SchedulesService) {}

  @MessagePattern('add_schedule')
  async addSchedule(
    @Payload() addScheduleDTO: AddScheduleDTO,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      const details = await this.schedulesService.addSchedule(addScheduleDTO);
      const schedule = await this.schedulesService.getScheduleById(
        details[0].id,
      );
      return { schedule: { ...schedule, details } };
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    } finally {
      channel.ack(originalMessage);
    }
  }

  @MessagePattern('get_schedule_by_journey_and_date')
  async getSchedulesByJourneyAndDate(
    @Payload() data: { journeyId: string; date: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      const schedule = await this.schedulesService.getScheduleByJourneyAndDate(
        data.journeyId,
        data.date,
      );
      if (!schedule) return { schedule: { ...schedule, details: [] } };
      const details = await this.schedulesService.getScheduleDetailsBySchedule(
        schedule.id,
      );
      return { schedule: { ...schedule, details } };
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    } finally {
      channel.ack(originalMessage);
    }
  }

  async getSchedulesByConditions(
    @Body() getSchedulesByConditionsDTO: GetSchedulesByConditionsDTO,
  ) {
    try {
      const schedules = await this.schedulesService.getSchedulesByConditions(
        getSchedulesByConditionsDTO,
      );
      return { schedules };
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  @MessagePattern('book_train')
  async bookTrain(
    @Payload() bookTrainDto: BookTrainDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      const isBookable = await this.schedulesService.bookTrain(bookTrainDto);
      return isBookable;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    } finally {
      channel.ack(originalMessage);
    }
  }
}
