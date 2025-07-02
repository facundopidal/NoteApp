import {
  BadRequestException,
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
    const user = await this.prisma.user.findUnique({
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
    const existingGroup = await this.prisma.group.findFirst({
      where: { name: createGroupDto.name, userId },
    });
    if (existingGroup) {
      throw new BadRequestException('Ya existe un grupo con ese nombre');
    }
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
    if (updateGroupDto.name) {
      const existingGroup = await this.prisma.group.findFirst({
        where: { name: updateGroupDto.name, userId },
      });
      if (existingGroup && existingGroup.id !== id) {
        throw new BadRequestException('Ya existe un grupo con ese nombre');
      }
    }

    return this.prisma.group.update({
      where: { id },
      data: updateGroupDto,
    });
  }

  async remove(id: string, userId: string) {
    await this.validateGroup(id, userId);
    // Si el grupo tiene notas, no se puede eliminar
    const notes = await this.prisma.note.findMany({
      where: { groupId: id },
    });
    if (notes.length > 0) {
      throw new BadRequestException('No se puede eliminar un grupo con notas');
    }

    return this.prisma.group.delete({ where: { id } });
  }
}
