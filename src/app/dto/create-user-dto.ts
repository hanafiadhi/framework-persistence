import { Prisma } from '@prisma/client';

export type CreateUserType = Prisma.UserCreateInput;

export class CreateUserDto implements CreateUserType {
  name: string;
  email: string;
  gender: string;
  social_media?: Prisma.SocialMediaCreateNestedManyWithoutUserInput;
}
