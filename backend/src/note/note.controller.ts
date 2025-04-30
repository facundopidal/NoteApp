import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('')
@UseGuards(AuthGuard)
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post('note')
  create(
    @Body() createNoteDto: CreateNoteDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.noteService.create(createNoteDto, req.user.sub);
  }

  @Get('notes/:groupId')
  findNotesByGroup(
    @Param('groupId') groupId: string,
    @Req() req: { user: { sub: string } },
  ) {
    return this.noteService.findAllByGroup(groupId, req.user.sub);
  }

  @Get('note/:id')
  findOne(@Param('id') id: string) {
    return this.noteService.findOne(id);
  }

  @Patch('note/:id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.noteService.update(id, updateNoteDto);
  }

  @Delete('note/:id')
  remove(@Param('id') id: string) {
    return this.noteService.remove(id);
  }
}
