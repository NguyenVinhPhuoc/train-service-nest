import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RegisterJourneyDTO } from 'src/dtos/journey.dto';
import { JourneysService } from './journeys.service';

@Controller('journeys')
export class JourneysController {
  private readonly logger = new Logger('JourneysController');
  constructor(private journeysService: JourneysService) {}

  // @MessagePattern('get_journeys_by_train')
  // async getJourneys(@Payload() vehicleId: string, @Ctx() context: RmqContext) {
  //   const channel = context.getChannelRef();
  //   const originalMessage = context.getMessage();
  //   try {
  //     const journeys = await this.journeysService.getJourneysByTrain(vehicleId);
  //     const journeysWithDetails = await Promise.all(
  //       journeys.map(async (journey) => {
  //         const stations = await this.journeysService.getJourneyDetails(
  //           journey.id,
  //         );
  //         return { ...journey, stations };
  //       }),
  //     );
  //     return { journeys: journeysWithDetails };
  //   } catch (error) {
  //     this.logger.error(error.message);
  //     throw HttpStatus.SERVICE_UNAVAILABLE;
  //   } finally {
  //     channel.ack(originalMessage);
  //   }
  // }

  @MessagePattern('register_journey')
  async postJourney(
    @Payload() registerJourneyDTO: RegisterJourneyDTO,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    const { vehicleId, stations } = registerJourneyDTO;
    try {
      const journey = await this.journeysService.addJourney(vehicleId);
      console.log(`journey`, journey);
      const journeyDetails = await this.journeysService.addJourneyDetail(
        journey.id,
        stations,
      );
      return {
        ...journey,
        stations: [...journeyDetails],
        message: 'Register journey successfully!',
      };
    } catch (error) {
      this.logger.error(error.message);
      throw HttpStatus.SERVICE_UNAVAILABLE;
    } finally {
      channel.ack(originalMessage);
    }
  }

  // @Patch(':journeyId')
  // async activateJourney(
  //   @Payload() journeyId: string,
  //   @Ctx() context: RmqContext,
  // ) {
  //   const channel = context.getChannelRef();
  //   const originalMessage = context.getMessage();
  //   try {
  //     const result = await this.journeysService.activateJourney(journeyId);
  //     if (!result) return 'Cannot activate journey!';
  //     return 'Activate journey successfully';
  //   } catch (error) {
  //     this.logger.error(error.message);
  //     throw HttpStatus.SERVICE_UNAVAILABLE;
  //   } finally {
  //     channel.ack(originalMessage);
  //   }
  // }
}
