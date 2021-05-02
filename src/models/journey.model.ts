import { Model } from 'sequelize';

export class Journey extends Model {
  id: string;
  isActive: boolean;
  trainId: string;
  createdAt: string;
}
