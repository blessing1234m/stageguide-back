import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EnregistrerFichierDto } from './dto/enregistrer-fichier.dto';
import { FichiersService } from './fichiers.service';

@ApiTags('fichiers')
@ApiBearerAuth()
@Controller('fichiers')
@UseGuards(JwtAuthGuard)
export class FichiersController {
  constructor(private readonly fichiersService: FichiersService) {}

  @ApiOperation({ summary: 'Liste les fichiers de l utilisateur connecte' })
  @Get()
  async lister(@CurrentUser() utilisateur: { id: string }) {
    return this.fichiersService.lister(utilisateur.id);
  }

  @ApiOperation({ summary: 'Enregistre les metadonnees d un fichier' })
  @Post()
  async enregistrer(
    @CurrentUser() utilisateur: { id: string },
    @Body() donnees: EnregistrerFichierDto,
  ) {
    return this.fichiersService.enregistrer(utilisateur.id, donnees);
  }
}
