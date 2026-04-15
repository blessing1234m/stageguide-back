import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../users/enums/user-role.enum';
import { ModifierProfilMentorDto } from './dto/modifier-profil-mentor.dto';
import { ProfilMentorService } from './profil.service';

@ApiTags('mentor')
@ApiBearerAuth()
@Controller('mentor/profil')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MENTOR)
export class ProfilMentorController {
  constructor(private readonly profilMentorService: ProfilMentorService) {}

  @ApiOperation({ summary: 'Recupere le profil mentor' })
  @Get()
  async getProfil(@CurrentUser() utilisateur: { id: string }) {
    return this.profilMentorService.getProfil(utilisateur.id);
  }

  @ApiOperation({ summary: 'Met a jour le profil mentor' })
  @Patch()
  async modifierProfil(
    @CurrentUser() utilisateur: { id: string },
    @Body() modification: ModifierProfilMentorDto,
  ) {
    return this.profilMentorService.modifierProfil(utilisateur.id, modification);
  }
}
