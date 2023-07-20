import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signin(dto: AuthDto) {
    // Find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // If user doesn't exist, throw an exception
    if (!user) throw new ForbiddenException('No user with this email exists!');

    // Compare passwords
    const matchingPassword = await argon.verify(user.hash, dto.password);
    // If password is incorrect, throw an exception]
    if (!matchingPassword) throw new ForbiddenException('Incorrect password!');

    // Return the user
    delete user.hash;
    return user;
  }
  async signup(dto: AuthDto) {
    // Generate the hashed password
    const hash = await argon.hash(dto.password);

    try {
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
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException(
          'Try another email, a user with this email already exists!',
        );
      }

      throw error;
    }
  }
}
