import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  getBookmarks(id: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId: id,
      },
    });
  }

  getBookmarkById(userId: number, id: number) {
    return this.prisma.bookmark.findUnique({
      where: {
        id,
        userId,
      },
    });
  }

  editBookmarkById(
    userId: number,
    id: number,
    dto: CreateBookmarkDto,
  ) {
    return this.prisma.bookmark.update({
      where: {
        id,
        userId,
      },
      data: {
        ...dto,
      },
    });
  }

  deleteBookmarkById(id: number) {
    return this.prisma.bookmark.delete({
      where: { id },
    });
  }

  createBookmark(
    userId: number,
    dto: CreateBookmarkDto,
  ) {
    return this.prisma.bookmark.create({
      data: { userId, ...dto },
    });
  }
}
