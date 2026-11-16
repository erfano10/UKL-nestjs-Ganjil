import { PartialType } from '@nestjs/mapped-types';
import { CreateElectricityAccountDto } from './create-electricity-account.dto.js';

export class UpdateElectricityAccountDto extends PartialType(CreateElectricityAccountDto) {}
