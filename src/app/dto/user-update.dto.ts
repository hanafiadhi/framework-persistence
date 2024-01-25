import { Prisma } from '@prisma/client';
import { UserIdDto } from './user-id.dto';

export type UserUpdateType = Prisma.UserUpdateInput;

export class UpdateUserDto extends UserIdDto implements UserUpdateType {
  name?: string | Prisma.StringFieldUpdateOperationsInput;
  gender?: string | Prisma.StringFieldUpdateOperationsInput;
  email?: string | Prisma.StringFieldUpdateOperationsInput;
  social_media?: Prisma.SocialMediaUpdateManyWithoutUserNestedInput;
  is_active?: boolean | Prisma.BoolFieldUpdateOperationsInput;
}
