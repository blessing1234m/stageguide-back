import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../users/enums/user-role.enum';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { AdminPartnerService } from './partner.service';
import { PartnerRecord } from './partner.types';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin/partners')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminPartnerController {
  constructor(private readonly adminPartnerService: AdminPartnerService) {}

  @ApiOperation({ summary: 'Liste tous les partenaires' })
  @ApiResponse({
    status: 200,
    description: 'Liste des partenaires retournee avec succes',
  })
  @Get()
  async findAll(): Promise<PartnerRecord[]> {
    return this.adminPartnerService.findAll();
  }

  @ApiOperation({ summary: 'Recupere le detail d un partenaire' })
  @ApiParam({
    name: 'id',
    description: 'Identifiant UUID du partenaire',
  })
  @ApiResponse({
    status: 200,
    description: 'Partenaire retourne avec succes',
  })
  @Get(':id')
  async findById(@Param('id') id: string): Promise<PartnerRecord> {
    return this.adminPartnerService.findById(id);
  }

  @ApiOperation({ summary: 'Cree un partenaire' })
  @ApiResponse({
    status: 201,
    description: 'Partenaire cree avec succes',
  })
  @Post()
  async create(
    @Body() createPartnerDto: CreatePartnerDto,
  ): Promise<PartnerRecord> {
    return this.adminPartnerService.create(createPartnerDto);
  }

  @ApiOperation({ summary: 'Met a jour un partenaire' })
  @ApiParam({
    name: 'id',
    description: 'Identifiant UUID du partenaire',
  })
  @ApiResponse({
    status: 200,
    description: 'Partenaire mis a jour avec succes',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePartnerDto: UpdatePartnerDto,
  ): Promise<PartnerRecord> {
    return this.adminPartnerService.update(id, updatePartnerDto);
  }

  @ApiOperation({ summary: 'Supprime un partenaire' })
  @ApiParam({
    name: 'id',
    description: 'Identifiant UUID du partenaire',
  })
  @ApiResponse({
    status: 200,
    description: 'Partenaire supprime avec succes',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.adminPartnerService.remove(id);
  }
}
