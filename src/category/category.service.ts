import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({ where: { name: dto.name } });
    if (existingCategory) throw new ConflictException('Category name already exists');

    return this.prisma.category.create({ data: { ...dto } });
  }

  async findAll(page: number = 1, limit: number = 10, name?: string) {
    const skip = (page - 1) * limit;

    const [categories, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({skip, take: limit }),
      this.prisma.category.count(),]);

    return { categories, total, page, limit };
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
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

