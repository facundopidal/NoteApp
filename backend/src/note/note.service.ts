import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NoteService {
  constructor(private prisma: PrismaService) {}

  async create(data: Omit<CreateNoteDto, 'userId'>, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('No se encontro el usuario');
    const group = await this.prisma.group.findUnique({
      where: { id: data.groupId },
    });
    if (!group || group.userId !== userId) {
      throw new ForbiddenException('No tienes acceso a ese grupo');
    }

    return this.prisma.note.create({ data: { ...data, userId } });
  }

  async findAllByGroup(groupId: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('No se encontro el usuario');

    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });
    if (!group || group.userId !== userId) {
      throw new ForbiddenException('No tienes acceso a ese grupo');
    }
    return this.prisma.note.findMany({
      where: { groupId, userId },
    });
  }

  async findOne(id: string) {
    return this.findNote(id);
  }

  async update(id: string, updateNoteDto: UpdateNoteDto) {
    await this.findNote(id);

    const updatedNote = this.prisma.note.update({
      where: { id: id },
      data: updateNoteDto,
    });

    return updatedNote;
  }

  async remove(id: string) {
    await this.findNote(id);

    return await this.prisma.note.delete({
      where: { id: id },
    });
  }

  private async findNote(id: string) {
    const note = await this.prisma.note.findUnique({
      where: { id: id },
    });

    if (!note) throw new NotFoundException('No se encontro la nota indicada');
    return note;
  }
}
