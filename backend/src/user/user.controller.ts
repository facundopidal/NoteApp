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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch('')
  @UseGuards(AuthGuard)
  update(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.userService.update(req.user.sub, updateUserDto);
  }

  @Delete('')
  @UseGuards(AuthGuard)
  remove(@Req() req: { user: { sub: string } }) {
    return this.userService.remove(req.user.sub);
  }
}
