import { PartialType } from '@nestjs/mapped-types';
import { CreateBillingDto } from './create-billing.dto.js';

export class UpdateBillingDto extends PartialType(CreateBillingDto) {}
