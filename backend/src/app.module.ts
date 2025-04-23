import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { NoteModule } from './note/note.module';
import { GroupModule } from './group/group.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [PrismaModule, NoteModule, GroupModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
