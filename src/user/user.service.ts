import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async myInfo(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { sessions: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async sessions(userId: number) {
    return this.prisma.session.findMany({
      where: { userId },
    });
  }

  async deleteSession(userId: number, sessionId: number) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (!session || session.userId !== userId) {
      throw new NotFoundException('Session not found or access denied');
    }
    return this.prisma.session.delete({
      where: { id: sessionId },
    });
  }
}

