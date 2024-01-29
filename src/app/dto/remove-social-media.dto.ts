import { Platform } from "@prisma/client";

export class RemoveSocialMediaDto {
  user_id: number;
  platform: Platform;
  username: string;
}
