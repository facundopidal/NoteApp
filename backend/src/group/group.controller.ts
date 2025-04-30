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
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('groups')
@UseGuards(AuthGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  create(
    @Body() createGroupDto: CreateGroupDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.groupService.create(createGroupDto, req.user.sub);
  }

  @Get()
  findAllByUser(@Req() req: { user: { sub: string } }) {
    return this.groupService.findAllByUser(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: { user: { sub: string } }) {
    return this.groupService.findOne(id, req.user.sub);
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.groupService.update(id, updateGroupDto, req.user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: { user: { sub: string } }) {
    return this.groupService.remove(id, req.user.sub);
  }
}
