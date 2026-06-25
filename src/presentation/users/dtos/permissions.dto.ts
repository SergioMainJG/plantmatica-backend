import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class PermissionsDto {
  @ApiProperty({
    description: 'Allows tracking of the user\'s age cohort for demographics',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  readonly isAgeAllowed: boolean = false;

  @ApiProperty({
    description: 'Allows tracking of the user\'s residence state for demographics',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  readonly isStateAllowed: boolean = false;

  @ApiProperty({
    description: 'Allows tracking of the user\'s gender for demographics',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  readonly isGenderAllowed: boolean = false;

  @ApiProperty({
    description: 'Opt-in for receiving promotional or marketing emails and notifications',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  readonly isMarketingAllowed: boolean = false;

  @ApiProperty({
    description: 'Opt-in for personalized advertisement profiling',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  readonly isAdsAllowed: boolean = false;
}