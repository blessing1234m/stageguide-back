import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Recherche un utilisateur par adresse email.
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
   * Recherche un utilisateur actif par identifiant.
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
   * Cree un nouvel utilisateur avec un mot de passe deja hache.
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
   * Remplace le mot de passe de l utilisateur par une nouvelle valeur hachee.
   */
  async updatePassword(userId: string, plainPassword: string): Promise<User> {
    const passwordHash = await bcrypt.hash(plainPassword, 12);

    return this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }
}
