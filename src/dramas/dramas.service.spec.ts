import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { vi } from 'vitest';
import { DramasService } from './dramas.service.js';
import { Drama } from './entities/drama.entity.js';

describe('DramasService', () => {
  let service: DramasService;
  const mockRepo = {
    find: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DramasService,
        { provide: getRepositoryToken(Drama), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<DramasService>(DramasService);
    vi.clearAllMocks();
  });

  it('should return all dramas', async () => {
    mockRepo.find.mockResolvedValue([{ id: 1, title: 'Reply 1988' }]);
    const result = await service.findAll();
    expect(result).toHaveLength(1);
  });

  it('should return a single drama when it exists', async () => {
    const drama = { id: 1, title: 'Reply 1988', genre: 'Drama' };
    mockRepo.findOne.mockResolvedValue(drama);

    const result = await service.findOne(1);

    expect(result).toEqual(drama);
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should throw NotFoundException if drama not found', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(999999)).rejects.toThrow(NotFoundException);
  });

  it('should create and persist a drama', async () => {
    const dto = { title: 'Crash Landing on You', genre: 'Romance' };
    const created = { id: 1, ...dto, watched: false };
    mockRepo.create.mockReturnValue(created);
    mockRepo.save.mockResolvedValue(created);

    const result = await service.create(dto);

    expect(result).toEqual(created);
    expect(mockRepo.create).toHaveBeenCalledWith(dto);
    expect(mockRepo.save).toHaveBeenCalledWith(created);
  });

  it('should update an existing drama', async () => {
    const drama = {
      id: 1,
      title: 'Reply 1988',
      genre: 'Drama',
      watched: false,
    };
    mockRepo.findOne.mockResolvedValue(drama);
    mockRepo.save.mockImplementation(async (value) => value);

    const result = await service.update(1, { watched: true });

    expect(result).toMatchObject({ id: 1, watched: true });
    expect(result.title).toBe('Reply 1988');
    expect(mockRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, watched: true }),
    );
  });

  it('should throw NotFoundException when updating a missing drama', async () => {
    mockRepo.findOne.mockResolvedValue(null);

    await expect(
      service.update(999999, { watched: true }),
    ).rejects.toThrow(NotFoundException);
    expect(mockRepo.save).not.toHaveBeenCalled();
  });

  it('should remove an existing drama', async () => {
    const drama = { id: 1, title: 'Reply 1988' };
    mockRepo.findOne.mockResolvedValue(drama);
    mockRepo.remove.mockResolvedValue(drama);

    const result = await service.remove(1);

    expect(result).toEqual({ deleted: true });
    expect(mockRepo.remove).toHaveBeenCalledWith(drama);
  });

  it('should throw NotFoundException when removing a missing drama', async () => {
    mockRepo.findOne.mockResolvedValue(null);

    await expect(service.remove(999999)).rejects.toThrow(NotFoundException);
    expect(mockRepo.remove).not.toHaveBeenCalled();
  });
});
