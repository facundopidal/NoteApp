import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @Transform(({ value }: { value: string }): string => value.trim())
  @IsString()
  @MinLength(6)
  password: string;
}
