import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  signin() {
    return {
      msg: 'Successfully signed in',
    };
  }
  async signup(dto: AuthDto) {
    // Generate the hashed password
    const hash = await argon.hash(dto.password);

    // Save the new user in the database
    const user = await this.prisma.user.create({
      data: {
        firstName: 'First_Name',
        lastName: 'Last_Name',
        email: dto.email,
        hash: hash,
      },
      // select: {
      //   createdAt: true,
      //   email: true,
      //   firstName: true,
      //   id: true,
      //   lastName: true,
      //   updatedAt: true,
      // },
    });

    delete user.hash; // Removes only that field

    // Return the saved user
    return user;
  }
}
