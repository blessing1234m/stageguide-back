import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../users/enums/user-role.enum';
import { ConventionsService } from './conventions.service';
import { CreerConventionDto } from './dto/creer-convention.dto';

@ApiTags('stagiaire')
@ApiBearerAuth()
@Controller('stagiaire/conventions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.STAGIAIRE)
export class ConventionsController {
  constructor(private readonly conventionsService: ConventionsService) {}

  @ApiOperation({ summary: 'Liste les conventions du stagiaire' })
  @Get()
  async lister(@CurrentUser() utilisateur: { id: string }) {
    return this.conventionsService.lister(utilisateur.id);
  }

  @ApiOperation({ summary: 'Cree une convention' })
  @Post()
  async creer(
    @CurrentUser() utilisateur: { id: string },
    @Body() donnees: CreerConventionDto,
  ) {
    return this.conventionsService.creer(utilisateur.id, donnees);
  }
}
