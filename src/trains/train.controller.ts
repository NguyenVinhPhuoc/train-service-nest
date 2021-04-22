import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { MessagePattern } from '@nestjs/microservices';
import { StationDTO } from 'src/dtos/station.dto';
import { TrainDTO } from 'src/dtos/train.dto';
import { TrainService } from './train.service';

@Controller('Trains')
export class TrainController {
  constructor(private readonly trainService: TrainService) {}

  @MessagePattern('get_trains_by_partner')
  async getTrainsByPartner(partnerId: string) {
    try {
      const trains = await this.trainService.getTrainByPartner(partnerId);
      return { trains };
    } catch (error) {
      throw HttpErrorByCode;
    }
  }

  @Get(':trainId')
  async getTrainById(@Param('trainId') trainId: string) {
    try {
      const train = await this.trainService.getTrainById(trainId);
      return train;
    } catch (error) {
      return HttpErrorByCode;
    }
  }

  @Get('station')
  async getBusesByStation(@Query() stationDTO: StationDTO) {
    try {
      const trains = await this.trainService.getTrainsByStation(stationDTO);
      return { trains };
    } catch (error) {
      throw HttpErrorByCode;
    }
  }

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
