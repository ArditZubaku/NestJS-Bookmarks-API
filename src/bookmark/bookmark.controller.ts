import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto';
import { GetUser } from '../auth/decorator';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(
    private bookmarkService: BookmarkService,
  ) {}

  @Post('new')
  createBookmark(
    @GetUser('id') userId: number,
    dto: CreateBookmarkDto,
  ) {
    return this.bookmarkService.createBookmark(
      userId,
      dto,
    );
  }

  @Get()
  getBookmarks(
    @GetUser('id')
    id: number,
  ) {
    return this.bookmarkService.getBookmarks(id);
  }

  @Get(':id')
  getBookmarkById(
    @GetUser('id') userId: number,
    @Param('id') id: string,
  ) {
    return this.bookmarkService.getBookmarkById(
      userId,
      +id,
    );
  }

  @Patch('edit/:id')
  editBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateBookmarkDto,
  ) {
    return this.bookmarkService.editBookmarkById(
      userId,
      id,
      dto,
    );
  }

  @Delete(':id')
  deleteBookmarkById(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.bookmarkService.deleteBookmarkById(
      id,
    );
  }
}
