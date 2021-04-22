import { Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { MessagePattern } from '@nestjs/microservices';
import { JourneysService } from './journeys.service';

@Controller('journeys')
export class JourneysController {
  constructor(private journeysService: JourneysService) {}

  @MessagePattern('get_journeys_by_bus')
  async getJourneys(trainId: string) {
    try {
      const journeys = await this.journeysService.getJourneysByBus(trainId);
      return { journeys };
    } catch (error) {
      throw HttpErrorByCode;
    }
  }

  @Post()
  async postJourney(@Query('trainId') trainId: string) {
    try {
      const journey = await this.journeysService.registerJourney(trainId);
      return { journey };
    } catch (error) {
      throw HttpErrorByCode;
    }
  }

  @Patch(':journeyId')
  async activateJourney(@Param('journeyId') journeyId: string) {
    try {
      const result = await this.journeysService.activateJourney(journeyId);
      if (!result) return 'Cannot activate journey!';
      return 'Activate journey successfully';
    } catch (error) {
      throw HttpErrorByCode;
    }
  }
}
