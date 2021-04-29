import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Query,
} from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { query } from 'express';
import { GetSchedulesByConditionsDTO } from 'src/dtos/get-schedules-by-conds.dto';
import { RegisterStationDTO } from 'src/dtos/station.dto';
import { TrainDTO } from 'src/dtos/train.dto';
import { SchedulesService } from 'src/schedules/schedules.service';
import { TrainService } from './train.service';

@Controller('Trains')
export class TrainController {
  private readonly logger = new Logger('TrainController');
  constructor(
    private readonly trainService: TrainService,
    private schedulesService: SchedulesService,
  ) {}

  // @MessagePattern('get_trains_by_partner')
  // async getTrainsByPartner(
  //   @Payload() partnerId: string,
  //   @Ctx() context: RmqContext,
  // ) {
  //   const channel = context.getChannelRef();
  //   const originalMessage = context.getMessage();
  //   try {
  //     const trains = await this.trainService.getTrainsByPartner(partnerId);
  //     return { trains };
  //   } catch (error) {
  //     this.logger.error(error.message);
  //     throw HttpStatus.SERVICE_UNAVAILABLE;
  //   } finally {
  //     channel.ack(originalMessage);
  //   }
  // }

  // @MessagePattern('get_trains_by_station')
  // async getBusesByStation(
  //   @Payload() departureStationDTO: RegisterStationDTO,
  //   @Ctx() context: RmqContext,
  // ) {
  //   const channel = context.getChannelRef();
  //   const originalMessage = context.getMessage();
  //   try {
  //     const trains = await this.trainService.getTrainsByStation(
  //       departureStationDTO,
  //     );
  //     return { trains };
  //   } catch (error) {
  //     this.logger.error(error.message);
  //     throw HttpStatus.SERVICE_UNAVAILABLE;
  //   } finally {
  //     channel.ack(originalMessage);
  //   }
  // }

  @MessagePattern('post_train')
  async postTrain(@Payload() trainDTO: TrainDTO, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      const train = await this.trainService.registerTrain(trainDTO);
      return { vehicle: train };
    } catch (error) {
      this.logger.error(error.message);
      throw HttpStatus.SERVICE_UNAVAILABLE;
    } finally {
      channel.ack(originalMessage);
    }
  }

  @Get('trainsfilter')
  async getTrainByFilter(@Body() schedulesDTO: GetSchedulesByConditionsDTO) {
    try {
      const schedules = await this.schedulesService.getSchedulesByConditions(
        schedulesDTO,
      );
      let trainId = [];
      schedules.forEach(async (schedule) => {
        try {
          trainId = await this.trainService.getTrainByJourney(
            schedule.journeyId,
          );
        } catch (error) {
          this.logger.error(error.message);
        }
      });
      return { trainId, ...schedules };
    } catch (error) {
      this.logger.error(error.message);
      throw HttpStatus.SERVICE_UNAVAILABLE;
    }
  }
}
