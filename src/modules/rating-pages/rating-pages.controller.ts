import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { PaginationQueryDto } from 'src/common/dto'
import { Roles } from 'src/decorators'
import { AuthGuard, RoleGuard } from 'src/guards'
import { Role } from 'src/guards/guards.enum'
import { PaginationInterceptor } from 'src/interceptors'
import { ValidationObjectIdPipe } from 'src/pipes'
import { CreateRatingPagesDto } from './dto/create-rating-pages.dto'
import { RatingPagesResponse } from './dto/rating-pages.response.dto'
import { RatingPagesService } from './rating-pages.service'
@ApiBearerAuth()
@ApiTags('rating-pages')
@Controller('rating-pages')
export class RatingPagesController {
  constructor(private readonly ratingPagesService: RatingPagesService) {}

  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({
    operationId: 'createRatingPages',
    description: 'create a Rating Pages',
  })
  @ApiOkResponse({ type: RatingPagesResponse })
  async createRatingPages(@Body() dto: CreateRatingPagesDto) {
    return this.ratingPagesService.createNewRatingPages(dto)
  }

  @Put('/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({
    operationId: 'updateRatingPages',
    description: 'update a Rating Pages By Id',
  })
  @ApiOkResponse({ type: CreateRatingPagesDto })
  async updateRatingPages(
    @Param('id', ValidationObjectIdPipe) id: string,
    @Body() dto: CreateRatingPagesDto,
  ) {
    return this.ratingPagesService.updateRatingPages(id, dto)
  }

  @Delete('/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({
    operationId: 'deleteRatingPages',
    description: 'Delete a Rating Pages By Id',
  })
  @ApiOkResponse({ type: RatingPagesResponse })
  async deleteRatingPages(@Param('id', ValidationObjectIdPipe) id: string) {
    return this.ratingPagesService.deleteRatingPages(id)
  }

  @Get('')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin, Role.Department, Role.Monitor, Role.Student, Role.Teacher)
  @ApiOperation({
    operationId: 'getAllRatingPages',
    description: 'Get All Rating Pages',
  })
  @ApiOkResponse({ type: [RatingPagesResponse] })
  @UseInterceptors(PaginationInterceptor)
  async getAllRatingPages(@Query() query: PaginationQueryDto) {
    return this.ratingPagesService.getAllRatingPages(query)
  }

  @Get('/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin, Role.Department, Role.Monitor, Role.Student, Role.Teacher)
  @ApiOperation({
    operationId: 'getRatingPagesById',
    description: 'Get Rating Pages By Id',
  })
  @ApiOkResponse({ type: RatingPagesResponse })
  async getRatingPagesById(@Param('id', ValidationObjectIdPipe) id: string) {
    return this.ratingPagesService.getRatingPagesById(id)
  }
}
