import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDramaDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    genre: string;

    @IsOptional()
    @IsBoolean()
    watched?: boolean;
}