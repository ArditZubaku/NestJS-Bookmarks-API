import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signin(dto: AuthDto) {
    // Find the user by email
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
    // If user doesn't exist, throw an exception
    if (!user)
      throw new ForbiddenException(
        'No user with this email exists!',
      );

    // Compare passwords
    const matchingPassword = await argon.verify(
      user.hash,
      dto.password,
    );
    // If password is incorrect, throw an exception]
    if (!matchingPassword)
      throw new ForbiddenException(
        'Incorrect password!',
      );

    return this.signToken(user.id, user.email);
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

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (
        error instanceof
          PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException(
          'Try another email, a user with this email already exists!',
        );
      }

      throw error;
    }
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email: email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '15m',
        secret: secret,
      },
    );

    return {
      access_token: token,
    };
  }
}
