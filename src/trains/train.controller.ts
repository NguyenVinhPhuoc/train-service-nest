import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { StationDTO } from 'src/dtos/station.dto';
import { TrainDTO } from 'src/dtos/train.dto';
import { TrainService } from './train.service';

@Controller('Trains')
export class TrainController {
  private readonly logger = new Logger('TrainController');
  constructor(private readonly trainService: TrainService) {}

  @MessagePattern('get_trains_by_partner')
  async getTrainsByPartner(
    @Payload() partnerId: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      const trains = await this.trainService.getTrainByPartner(partnerId);
      return { trains };
    } catch (error) {
      this.logger.error(error.message);
      throw HttpStatus.SERVICE_UNAVAILABLE;
    } finally {
      channel.ack(originalMessage);
    }
  }

  @MessagePattern('get_trains_by_station')
  async getBusesByStation(
    @Payload() departureStationDTO: StationDTO,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      const trains = await this.trainService.getTrainsByStation(
        departureStationDTO,
      );
      return { trains };
    } catch (error) {
      this.logger.error(error.message);
      throw HttpStatus.SERVICE_UNAVAILABLE;
    } finally {
      channel.ack(originalMessage);
    }
  }

  // @Get('station')
  // async getTrainsByStation(@Query() stationDTO: StationDTO) {
  //   try {
  //     const trains = await this.trainService.getTrainsByStation(stationDTO);
  //     return { trains };
  //   } catch (error) {
  //     throw HttpErrorByCode;
  //   }
  // }

  // @Get(':trainId')
  // async getTrainById(@Param('trainId') trainId: string) {
  //   try {
  //     const train = await this.trainService.getTrainById(trainId);
  //     return train;
  //   } catch (error) {
  //     return HttpErrorByCode;
  //   }
  // }

  @Post()
  async postTrain(@Body() trainDTO: TrainDTO) {
    try {
      const train = await this.trainService.registerTrain(trainDTO);
      return train;
    } catch (error) {
      return HttpErrorByCode;
    }
  }
}
