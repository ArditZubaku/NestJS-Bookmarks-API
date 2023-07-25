import {
  IsOptional,
  IsString,
} from 'class-validator';

export class EditBookmarkDto {
  @IsString()
  @IsOptional()
  title?: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
  @IsOptional() // We put IsOptional for the validation to know
  link?: string; // We put '?' for TypeScript to know
}
