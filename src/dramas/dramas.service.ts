import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Drama } from './entities/drama.entity.js';
import { CreateDramaDto } from './dto/create-drama.dto.js';
import { UpdateDramaDto } from './dto/update-drama.dto.js';

@Injectable()
export class DramasService {
  constructor(
    @InjectRepository(Drama) private dramaRepo: Repository<Drama>,
  ) {}

  findAll() {
    return this.dramaRepo.find();
  }

  async findOne(id: number) {
    const drama = await this.dramaRepo.findOne({ where: { id } });
    if (!drama) throw new NotFoundException(`Drama with id ${id} not found`);
    return drama;
  }

  create(dto: CreateDramaDto) {
    const drama = this.dramaRepo.create(dto);
    return this.dramaRepo.save(drama);
  }

  async update(id: number, dto: UpdateDramaDto) {
    const drama = await this.findOne(id);
    Object.assign(drama, dto);
    return this.dramaRepo.save(drama);
  }

  async remove(id: number) {
    const drama = await this.findOne(id);
    await this.dramaRepo.remove(drama);
    return { deleted: true };
  }
}