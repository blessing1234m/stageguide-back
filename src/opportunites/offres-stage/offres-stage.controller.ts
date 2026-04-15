import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListerOffresStageDto } from './dto/lister-offres-stage.dto';
import { OffresStageService } from './offres-stage.service';

@ApiTags('opportunites')
@Controller('opportunites/offres-stage')
export class OffresStageController {
  constructor(private readonly offresStageService: OffresStageService) {}

  @ApiOperation({ summary: 'Liste les offres de stage' })
  @Get()
  async lister(@Query() filtres: ListerOffresStageDto) {
    return this.offresStageService.lister(filtres);
  }
}
