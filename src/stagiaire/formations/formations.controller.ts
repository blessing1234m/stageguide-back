import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../users/enums/user-role.enum';
import { FormationsService } from './formations.service';

@ApiTags('stagiaire')
@ApiBearerAuth()
@Controller('stagiaire/formations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.STAGIAIRE)
export class FormationsController {
  constructor(private readonly formationsService: FormationsService) {}

  @ApiOperation({ summary: 'Liste le catalogue des formations' })
  @Get()
  async listerCatalogue() {
    return this.formationsService.listerCatalogue();
  }

  @ApiOperation({ summary: 'Liste les formations du stagiaire' })
  @Get('mes-formations')
  async listerMesFormations(@CurrentUser() utilisateur: { id: string }) {
    return this.formationsService.listerMesFormations(utilisateur.id);
  }
}
