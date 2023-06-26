import { PetopiaInterface } from 'interfaces/petopia';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface PetInterface {
  id?: string;
  name: string;
  health_record?: string;
  pedigree?: string;
  snack_count?: number;
  money_spent?: number;
  points?: number;
  petopia_id: string;
  owner_id: string;
  created_at?: any;
  updated_at?: any;

  petopia?: PetopiaInterface;
  user?: UserInterface;
  _count?: {};
}

export interface PetGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  health_record?: string;
  pedigree?: string;
  petopia_id?: string;
  owner_id?: string;
}
