import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // this makes it available for the whole modules
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // always gotta tell what you want to export
})
export class PrismaModule {}
