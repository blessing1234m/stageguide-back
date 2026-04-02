import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Finds a user by email address.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        deletedAt: null,
      },
    });
  }

  /**
   * Finds an active user by identifier.
   */
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  /**
   * Creates a new platform user with a pre-hashed password.
   */
  async create(data: {
    email: string;
    passwordHash: string;
    prenom: string;
    nom: string;
    telephone?: string | null;
    ecole?: string | null;
    niveauEtudes?: string | null;
    entreprise?: string | null;
    poste?: string | null;
    bio?: string | null;
    role: Prisma.UserCreateInput['role'];
    consentGiven?: boolean;
    consentDate?: Date | null;
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash,
        prenom: data.prenom,
        nom: data.nom,
        telephone: data.telephone ?? null,
        ecole: data.ecole ?? null,
        niveauEtudes: data.niveauEtudes ?? null,
        entreprise: data.entreprise ?? null,
        poste: data.poste ?? null,
        bio: data.bio ?? null,
        role: data.role,
        consentGiven: data.consentGiven ?? false,
        consentDate: data.consentDate ?? null,
      },
    });
  }

  /**
   * Replaces the user's password with a newly hashed value.
   */
  async updatePassword(userId: string, plainPassword: string): Promise<User> {
    const passwordHash = await bcrypt.hash(plainPassword, 12);

    return this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }
}
