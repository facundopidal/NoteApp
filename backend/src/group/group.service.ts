import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUser(userId: string) {
    const user = await this.prisma.group.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('No se encontro el usuario');

    return user;
  }

  async validateGroup(id: string, userId?: string) {
    const group = await this.prisma.group.findUnique({
      where: { id },
    });
    if (!group) {
      throw new NotFoundException('No se encontro el grupo');
    }
    if (userId && group.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para ver este grupo');
    }

    return group;
  }

  async create(createGroupDto: Omit<CreateGroupDto, 'userId'>, userId: string) {
    await this.validateUser(userId);
    return this.prisma.group.create({
      data: { ...createGroupDto, userId },
    });
  }

  async findAllByUser(userId: string) {
    await this.validateUser(userId);
    return this.prisma.group.findMany({
      where: { userId },
    });
  }

  async findOne(id: string, userId: string) {
    await this.validateUser(userId);

    return this.prisma.group.findUnique({
      where: { id, userId },
    });
  }

  async update(id: string, updateGroupDto: UpdateGroupDto, userId: string) {
    await this.validateGroup(id, userId);

    return this.prisma.group.update({
      where: { id },
      data: updateGroupDto,
    });
  }

  async remove(id: string, userId: string) {
    await this.validateGroup(id, userId);

    return this.prisma.group.delete({ where: { id } });
  }
}
