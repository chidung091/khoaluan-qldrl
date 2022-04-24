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
  ApiOperation,
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { PaginationQueryDto } from 'src/common/dto'
import { Roles } from 'src/decorators'
import { AuthGuard, RoleGuard } from 'src/guards'
import { Role } from 'src/guards/guards.enum'
import { PaginationInterceptor } from 'src/interceptors'
import { ValidationObjectIdPipe } from 'src/pipes'
import { CreatePointFrameDto } from './dto/create-point-frame.dto'
import { PointFrameResponse } from './dto/point-frame.response.dto'
import { PointFrameService } from './point-frame.service'

@ApiTags('point-frame')
@Controller('point-frame')
export class PointFrameController {
  constructor(private readonly pointFrameSerivce: PointFrameService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({
    operationId: 'createPointFrame',
    description: 'create a Rating Pages',
  })
  @ApiOkResponse({ type: PointFrameResponse })
  async createPointFrame(@Body() dto: CreatePointFrameDto) {
    return this.pointFrameSerivce.createNewPointFrame(dto)
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({
    operationId: 'updatePointFrame',
    description: 'update a Rating Pages By Id',
  })
  @ApiOkResponse({ type: PointFrameResponse })
  async updatePointFrame(
    @Param('id', ValidationObjectIdPipe) id: string,
    @Body() dto: CreatePointFrameDto,
  ) {
    return this.pointFrameSerivce.updateRatingPages(id, dto)
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({
    operationId: 'deletePointFrame',
    description: 'Delete a Rating Pages By Id',
  })
  @ApiOkResponse({ type: PointFrameResponse })
  async deleteRatingPages(@Param('id', ValidationObjectIdPipe) id: string) {
    return this.pointFrameSerivce.deleteRatingPages(id)
  }

  @Get('')
  @ApiOperation({
    operationId: 'getAllPointFrame',
    description: 'Get All Rating Pages',
  })
  @ApiOkResponse({ type: [PointFrameResponse] })
  @UseInterceptors(PaginationInterceptor)
  async getAllRatingPages(@Query() query: PaginationQueryDto) {
    return this.pointFrameSerivce.getAllRatingPages(query)
  }

  @Get('/:id')
  @ApiOperation({
    operationId: 'getPointFrameById',
    description: 'Get Rating Pages By Id',
  })
  @ApiOkResponse({ type: [PointFrameResponse] })
  async getRatingPagesById(@Param('id', ValidationObjectIdPipe) id: string) {
    return this.pointFrameSerivce.getRatingPagesById(id)
  }
}
