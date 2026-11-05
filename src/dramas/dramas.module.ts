import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drama } from './entities/drama.entity.js';
import { DramasService } from './dramas.service.js';
import { DramasController } from './dramas.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Drama]), AuthModule],
  controllers: [DramasController],
  providers: [DramasService],
  exports: [DramasService, TypeOrmModule],
})
export class DramasModule {}