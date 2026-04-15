import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../users/enums/user-role.enum';
import { CreerDemandeMentoratDto } from './dto/creer-demande-mentorat.dto';
import { MentoratStagiaireService } from './mentorat.service';

@ApiTags('stagiaire')
@ApiBearerAuth()
@Controller('stagiaire/mentorat')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.STAGIAIRE)
export class MentoratStagiaireController {
  constructor(private readonly mentoratService: MentoratStagiaireService) {}

  @ApiOperation({ summary: 'Liste les demandes de mentorat du stagiaire' })
  @Get('demandes')
  async listerDemandes(@CurrentUser() utilisateur: { id: string }) {
    return this.mentoratService.listerDemandes(utilisateur.id);
  }

  @ApiOperation({ summary: 'Cree une demande de mentorat' })
  @Post('demandes')
  async creerDemande(
    @CurrentUser() utilisateur: { id: string },
    @Body() donnees: CreerDemandeMentoratDto,
  ) {
    return this.mentoratService.creerDemande(utilisateur.id, donnees);
  }
}
