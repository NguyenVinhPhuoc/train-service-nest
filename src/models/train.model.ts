import { Model } from 'sequelize';

export class Train extends Model {
  id: string;
  name: string;
  photoUrl: string;
  partnerId: string;
  ticketPrice: number;
  isRegistered: boolean;
  createAt: string;
  updatedAt: string;
}
