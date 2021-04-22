import { Model } from 'sequelize';

export class Journey extends Model {
  id: string;
  name: string;
  guestQuantity: number;
  photoUrl: string;
  ticketPrice: number;
  partnerId: string;
  createdAt: Date;
  updatedAt: Date;
}
