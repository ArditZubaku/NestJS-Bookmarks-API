import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  signin() {
    return {
      msg: 'Successfully signed in',
    };
  }
  signup() {
    return {
      msg: 'Successfully signed up',
    };
  }
}
