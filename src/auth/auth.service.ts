import { Injectable } from '@nestjs/common';
// import { User, Bookmark } from '@prisma/client'
// const prisma = new PrismaClient()

@Injectable({})
export class AuthService {
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
