import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../users/enums/user-role.enum';
import { ModifierProfilStagiaireDto } from './dto/modifier-profil-stagiaire.dto';
import { ProfilStagiaireService } from './profil.service';

@ApiTags('stagiaire')
@ApiBearerAuth()
@Controller('stagiaire/profil')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.STAGIAIRE)
export class ProfilStagiaireController {
  constructor(private readonly profilStagiaireService: ProfilStagiaireService) {}

  @ApiOperation({ summary: 'Recupere le profil stagiaire' })
  @Get()
  async getProfil(@CurrentUser() utilisateur: { id: string }) {
    return this.profilStagiaireService.getProfil(utilisateur.id);
  }

  @ApiOperation({ summary: 'Met a jour le profil stagiaire' })
  @ApiResponse({ status: 200, description: 'Profil mis a jour avec succes' })
  @Patch()
  async modifierProfil(
    @CurrentUser() utilisateur: { id: string },
    @Body() modification: ModifierProfilStagiaireDto,
  ) {
    return this.profilStagiaireService.modifierProfil(
      utilisateur.id,
      modification,
    );
  }
}
