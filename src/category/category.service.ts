import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) {}

  async create(dto: CreateCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { name: dto.name },
    });
    if (existingCategory) throw new ConflictException('Category name already exists');

    return this.prisma.category.create({ data: { ...dto } });
  }

  async findAll(page: number = 1, limit: number = 10, name?: string) {
    const skip = (page - 1) * limit;
    const cacheKey = `categories:all:page=${page}:limit=${limit}`;

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const [categories, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({ skip, take: limit }),
      this.prisma.category.count(),
    ]);

    const result = { categories, total, page, limit };
    await this.cacheManager.set(cacheKey, result, 60);
    return result;
  }

  async findOne(id: number) {
    const cacheKey = `categories:${id}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    await this.cacheManager.set(cacheKey, category, 60);
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.findOne(id);
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.category.delete({ where: { id } });
  }
}
