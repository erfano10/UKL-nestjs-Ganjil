import { PartialType } from '@nestjs/mapped-types';
import { CreateElectricityServiceDto } from './create-electricity-service.dto.js';

export class UpdateElectricityServiceDto extends PartialType(CreateElectricityServiceDto) {}
