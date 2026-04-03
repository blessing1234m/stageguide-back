import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PartnerRecord } from './partner.types';

@Injectable()
export class AdminPartnerService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<PartnerRecord[]> {
    return this.prisma.$queryRaw<PartnerRecord[]>(Prisma.sql`
      SELECT
        "id",
        "nomEntreprise",
        "ville",
        "email",
        "lienSiteWeb",
        "createdAt",
        "updatedAt"
      FROM "partners"
      ORDER BY "createdAt" DESC
    `);
  }

  async findById(id: string): Promise<PartnerRecord> {
    const result = await this.prisma.$queryRaw<PartnerRecord[]>(Prisma.sql`
      SELECT
        "id",
        "nomEntreprise",
        "ville",
        "email",
        "lienSiteWeb",
        "createdAt",
        "updatedAt"
      FROM "partners"
      WHERE "id" = ${id}
      LIMIT 1
    `);

    const partner = result[0];

    if (!partner) {
      throw new NotFoundException('Partenaire introuvable');
    }

    return partner;
  }

  async create(createPartnerDto: CreatePartnerDto): Promise<PartnerRecord> {
    await this.ensureEmailIsAvailable(createPartnerDto.email);

    const result = await this.prisma.$queryRaw<PartnerRecord[]>(Prisma.sql`
      INSERT INTO "partners" (
        "id",
        "nomEntreprise",
        "ville",
        "email",
        "lienSiteWeb",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        ${randomUUID()},
        ${createPartnerDto.nomEntreprise},
        ${createPartnerDto.ville},
        ${createPartnerDto.email.toLowerCase()},
        ${createPartnerDto.lienSiteWeb ?? null},
        NOW(),
        NOW()
      )
      RETURNING
        "id",
        "nomEntreprise",
        "ville",
        "email",
        "lienSiteWeb",
        "createdAt",
        "updatedAt"
    `);

    return result[0];
  }

  async update(id: string, updatePartnerDto: UpdatePartnerDto): Promise<PartnerRecord> {
    await this.findById(id);

    const normalizedEmail = updatePartnerDto.email?.toLowerCase();

    if (normalizedEmail) {
      const existing = await this.prisma.$queryRaw<PartnerRecord[]>(Prisma.sql`
        SELECT "id"
        FROM "partners"
        WHERE "email" = ${normalizedEmail}
          AND "id" <> ${id}
        LIMIT 1
      `);

      if (existing.length > 0) {
        throw new ConflictException('Un partenaire existe deja avec cet email');
      }
    }

    const updates: Prisma.Sql[] = [];

    if (updatePartnerDto.nomEntreprise !== undefined) {
      updates.push(Prisma.sql`"nomEntreprise" = ${updatePartnerDto.nomEntreprise}`);
    }
    if (updatePartnerDto.ville !== undefined) {
      updates.push(Prisma.sql`"ville" = ${updatePartnerDto.ville}`);
    }
    if (normalizedEmail !== undefined) {
      updates.push(Prisma.sql`"email" = ${normalizedEmail}`);
    }
    if (updatePartnerDto.lienSiteWeb !== undefined) {
      updates.push(Prisma.sql`"lienSiteWeb" = ${updatePartnerDto.lienSiteWeb}`);
    }

    updates.push(Prisma.sql`"updatedAt" = NOW()`);

    const result = await this.prisma.$queryRaw<PartnerRecord[]>(Prisma.sql`
      UPDATE "partners"
      SET ${Prisma.join(updates, ', ')}
      WHERE "id" = ${id}
      RETURNING
        "id",
        "nomEntreprise",
        "ville",
        "email",
        "lienSiteWeb",
        "createdAt",
        "updatedAt"
    `);

    return result[0];
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findById(id);

    await this.prisma.$executeRaw(Prisma.sql`
      DELETE FROM "partners"
      WHERE "id" = ${id}
    `);

    return { message: 'Partenaire supprime avec succes' };
  }

  private async ensureEmailIsAvailable(email: string): Promise<void> {
    const existing = await this.prisma.$queryRaw<PartnerRecord[]>(Prisma.sql`
      SELECT "id"
      FROM "partners"
      WHERE "email" = ${email.toLowerCase()}
      LIMIT 1
    `);

    if (existing.length > 0) {
      throw new ConflictException('Un partenaire existe deja avec cet email');
    }
  }
}
