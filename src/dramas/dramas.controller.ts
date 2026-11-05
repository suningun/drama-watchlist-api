import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards,
} from '@nestjs/common';
import { DramasService } from './dramas.service.js';
import { CreateDramaDto } from './dto/create-drama.dto.js';
import { UpdateDramaDto } from './dto/update-drama.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('items')
export class DramasController {
    constructor(private readonly dramasService: DramasService) {}

    @Get()
    findAll() {
        return this.dramasService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.dramasService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreateDramaDto) {
        return this.dramasService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDramaDto) {
        return this.dramasService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.dramasService.remove(id);
    }
}