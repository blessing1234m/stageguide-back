import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../users/enums/user-role.enum';
import { CreerProjetDto } from './dto/creer-projet.dto';
import { ModifierProjetDto } from './dto/modifier-projet.dto';
import { PortfolioService } from './portfolio.service';

@ApiTags('stagiaire')
@ApiBearerAuth()
@Controller('stagiaire/portfolio/projets')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.STAGIAIRE)
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @ApiOperation({ summary: 'Liste les projets du portfolio' })
  @Get()
  async listerProjets(@CurrentUser() utilisateur: { id: string }) {
    return this.portfolioService.listerProjets(utilisateur.id);
  }

  @ApiOperation({ summary: 'Cree un projet de portfolio' })
  @Post()
  async creerProjet(
    @CurrentUser() utilisateur: { id: string },
    @Body() donnees: CreerProjetDto,
  ) {
    return this.portfolioService.creerProjet(utilisateur.id, donnees);
  }

  @ApiOperation({ summary: 'Met a jour un projet de portfolio' })
  @ApiParam({ name: 'id', description: 'Identifiant du projet' })
  @ApiResponse({ status: 200, description: 'Projet mis a jour avec succes' })
  @Patch(':id')
  async modifierProjet(
    @CurrentUser() utilisateur: { id: string },
    @Param('id') projetId: string,
    @Body() donnees: ModifierProjetDto,
  ) {
    return this.portfolioService.modifierProjet(
      utilisateur.id,
      projetId,
      donnees,
    );
  }

  @ApiOperation({ summary: 'Supprime un projet de portfolio' })
  @Delete(':id')
  async supprimerProjet(
    @CurrentUser() utilisateur: { id: string },
    @Param('id') projetId: string,
  ) {
    return this.portfolioService.supprimerProjet(utilisateur.id, projetId);
  }
}
