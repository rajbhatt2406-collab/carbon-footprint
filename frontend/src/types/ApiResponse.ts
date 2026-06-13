import { User } from './User';

export interface AuthResponse {
  token: string;
  user: User;
}

export interface OcrResponse {
  inputs: {
    carKm?: number;
    bikeKm?: number;
    busKm?: number;
    trainKm?: number;
    electricityKwh?: number;
    foodHabit?: string;
    shoppingHabit?: string;
  };
  rawText?: string;
}

export interface ErrorResponse {
  error: string;
}
