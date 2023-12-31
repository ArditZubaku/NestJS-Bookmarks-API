import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateBookmarkDto,
  EditBookmarkDto,
} from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
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

  createBookmark(
    userId: number,
    dto: CreateBookmarkDto,
  ) {
    return this.prisma.bookmark.create({
      data: { userId, ...dto },
    });
  }

  async editBookmarkById(
    userId: number,
    id: number,
    dto: EditBookmarkDto,
  ) {
    const bookmark =
      await this.prisma.bookmark.findUnique({
        where: {
          id,
        },
      });
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException(
        'Access to resource denied',
      );

    return this.prisma.bookmark.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookmarkById(
    userId: number,
    id: number,
  ) {
    const bookmark =
      await this.prisma.bookmark.findUnique({
        where: {
          id,
        },
      });

    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException(
        'Access to resource denied!',
      );

    await this.prisma.bookmark.delete({
      where: { id, userId },
    });
  }
}
