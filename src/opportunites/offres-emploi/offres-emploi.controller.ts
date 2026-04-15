import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListerOffresEmploiDto } from './dto/lister-offres-emploi.dto';
import { OffresEmploiService } from './offres-emploi.service';

@ApiTags('opportunites')
@Controller('opportunites/offres-emploi')
export class OffresEmploiController {
  constructor(private readonly offresEmploiService: OffresEmploiService) {}

  @ApiOperation({ summary: 'Liste les offres d emploi' })
  @Get()
  async lister(@Query() filtres: ListerOffresEmploiDto) {
    return this.offresEmploiService.lister(filtres);
  }
}
