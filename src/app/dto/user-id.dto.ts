import { IsNumber } from 'class-validator';

export type UserId = number;

export class UserIdDto {
  @IsNumber()
  id: UserId;
}
