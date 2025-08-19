import { IsString, Length, Matches } from 'class-validator';

export class AttemptSolveDto {
  @IsString()
  @Length(4, 4)               
  @Matches(/^\d+$/)           
  value!: string;
}