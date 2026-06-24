import {IsBoolean, IsNotEmpty} from 'class-validator'

export class PermissionsDto{
    @IsBoolean()
  @IsNotEmpty()
  readonly isAgeAllowed: boolean = false;

  @IsBoolean()
  @IsNotEmpty()
  readonly isStateAllowed: boolean = false;
  
  @IsBoolean()
  @IsNotEmpty()
  readonly isGenderAllowed: boolean= false;
  
  @IsBoolean()
  @IsNotEmpty()
  readonly isMarketingAllowed: boolean = false;
  
  @IsBoolean()
  @IsNotEmpty()
  readonly isAdsAllowed: boolean = false; 
}