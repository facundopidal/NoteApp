import { IsString, IsUUID } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  name: string;
  @IsUUID()
  userId: string;
}
