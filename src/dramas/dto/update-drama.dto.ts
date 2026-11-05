import { PartialType } from '@nestjs/mapped-types';
import { CreateDramaDto } from './create-drama.dto.js';

export class UpdateDramaDto extends PartialType(CreateDramaDto) {}