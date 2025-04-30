import { Transform } from 'class-transformer';
import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateNoteDto {
  @Transform(({ value }: { value: string }): string => value.trim())
  @IsString()
  @MinLength(1)
  title: string;

  @Transform(({ value }: { value: string }): string => value.trim())
  @IsString()
  @MinLength(1)
  content: string;

  @IsUUID()
  userId: string;

  @IsUUID()
  groupId: string;
}
