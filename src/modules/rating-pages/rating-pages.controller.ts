import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { PaginationQueryDto } from 'src/common/dto'
import { PaginationInterceptor } from 'src/interceptors'
import { ValidationObjectIdPipe } from 'src/pipes'
import { CreateRatingPagesDto } from './dto/create-rating-pages.dto'
import { RatingPagesResponse } from './dto/rating-pages.response.dto'
import { RatingPagesService } from './rating-pages.service'

@ApiTags('rating-pages')
@Controller('rating-pages')
export class RatingPagesController {
  constructor(private readonly ratingPagesService: RatingPagesService) {}

  @Post()
  @ApiOkResponse({ type: RatingPagesResponse })
  async create(@Body() dto: CreateRatingPagesDto) {
    return this.ratingPagesService.createNewRatingPages(dto)
  }

  @Put('/:id')
  @ApiOperation({
    operationId: 'updateRateCard',
    description: 'update a rate card',
  })
  @ApiOkResponse({ type: CreateRatingPagesDto })
  updateRateCard(
    @Param('id', ValidationObjectIdPipe) id: string,
    @Body() dto: CreateRatingPagesDto,
  ) {
    return this.ratingPagesService.updateRatingPages(id, dto)
  }

  @Delete('/:id')
  @ApiOperation({
    operationId: 'deleteRateCard',
    description: 'delete a rate card',
  })
  @ApiOkResponse({ type: RatingPagesResponse })
  deleteRateCard(@Param('id', ValidationObjectIdPipe) id: string) {
    return this.ratingPagesService.deleteRatingPages(id)
  }

  @Get('')
  @ApiOperation({
    operationId: 'getAllRateCard',
    description: 'Retrieve my payment history',
  })
  @ApiOkResponse({ type: [RatingPagesResponse] })
  @UseInterceptors(PaginationInterceptor)
  getAllRateCard(@Query() query: PaginationQueryDto) {
    return this.ratingPagesService.getAllRatingPages(query)
  }

  @Get('/:id')
  @ApiOperation({
    operationId: 'getRatingPagesById',
    description: 'Get Rating Pages By Id',
  })
  @ApiOkResponse({ type: RatingPagesResponse })
  getRatingPagesById(@Param('id', ValidationObjectIdPipe) id: string) {
    return this.ratingPagesService.getRatingPagesById(id)
  }
}