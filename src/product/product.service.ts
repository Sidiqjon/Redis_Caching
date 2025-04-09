import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) {}

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({ data: { ...dto } });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const cacheKey = `products:all:page=${page}:limit=${limit}`;

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({ skip, take: limit }),
      this.prisma.product.count(),
    ]);

    const result = { products, total, page, limit };
    await this.cacheManager.set(cacheKey, result, 60);
    return result;
  }

  async findOne(id: number) {
    const cacheKey = `products:${id}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    await this.cacheManager.set(cacheKey, product, 60);
    return product;
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }
}
