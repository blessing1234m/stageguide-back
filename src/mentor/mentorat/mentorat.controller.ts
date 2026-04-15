import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../users/enums/user-role.enum';
import { RepondreDemandeMentoratDto } from './dto/repondre-demande-mentorat.dto';
import { MentoratMentorService } from './mentorat.service';

@ApiTags('mentor')
@ApiBearerAuth()
@Controller('mentor/mentorat')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MENTOR)
export class MentoratMentorController {
  constructor(private readonly mentoratService: MentoratMentorService) {}

  @ApiOperation({ summary: 'Liste les demandes de mentorat adressees au mentor' })
  @Get('demandes')
  async listerDemandes(@CurrentUser() utilisateur: { id: string }) {
    return this.mentoratService.listerDemandes(utilisateur.id);
  }

  @ApiOperation({ summary: 'Repond a une demande de mentorat' })
  @ApiParam({ name: 'id', description: 'Identifiant de la demande de mentorat' })
  @Patch('demandes/:id/reponse')
  async repondre(
    @CurrentUser() utilisateur: { id: string },
    @Param('id') demandeId: string,
    @Body() donnees: RepondreDemandeMentoratDto,
  ) {
    return this.mentoratService.repondre(utilisateur.id, demandeId, donnees);
  }
}
