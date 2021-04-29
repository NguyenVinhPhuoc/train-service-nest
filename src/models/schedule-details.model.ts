import { Model } from 'sequelize';

export class ScheduleDetails extends Model {
  id: string;
  scheduleId: string;
  departAt: string;
  arrivalAt: string;
}
