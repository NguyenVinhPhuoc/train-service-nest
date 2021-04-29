import { RegisterStationDTO } from './station.dto';

export class RegisterJourneyDTO {
  vehicleId: string;
  stations: RegisterStationDTO[];
}
