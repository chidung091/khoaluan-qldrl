import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { ApiOperation, ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Roles } from 'src/decorators'
import { AuthGuard, RoleGuard } from 'src/guards'
import { Role } from 'src/guards/guards.enum'
import { CreateMarkMonitorDto } from './dto/create-mark-monitor.dto'
import {
  CreateMarkTeacherDto,
  CreateMarkTeacherParamDto,
} from './dto/create-mark-teacher.dto'
import { CreateMark } from './dto/create-mark.dto'
import { GetMarkDto } from './dto/get-mark.dto'
import { GetScoreMarkDto } from './dto/get-score-mark.dto'
import { MarkService } from './mark.service'

@ApiBearerAuth()
@ApiTags('mark')
@Controller('mark')
export class MarkController {
  constructor(private readonly markService: MarkService) {}

  @Get('/:studentId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Department, Role.Monitor, Role.Student, Role.Teacher)
  @ApiOperation({
    operationId: 'get-Mark',
    description: 'create a Rating Pages',
  })
  async getMarkStudent(@Req() req, @Param('studentId') studentId: number) {
    return this.markService.getScore(req.user.userID, studentId, req.user.role)
  }

  @MessagePattern({ role: 'mark', cmd: 'get-score' })
  async getScore(@Body() dto: GetScoreMarkDto) {
    return this.markService.calculationScore(dto.studentId, dto.type)
  }

  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Student)
  @ApiOperation({
    operationId: 'create-Mark-Student',
    description: 'create a Rating Pages',
  })
  async createMarkStudent(@Req() req, @Body() dto: CreateMark) {
    return this.markService.createMark(req.user.userID, dto)
  }

  @Post('/teacher/:classId/student/:studentId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Teacher)
  @ApiOperation({
    operationId: 'create-Mark-Teacher',
    description: 'create a Rating Pages',
  })
  async createMarkTeacher(
    @Req() req,
    @Param()
    { classId, studentId }: CreateMarkTeacherParamDto,
    @Body() dto: CreateMarkTeacherDto,
  ) {
    return this.markService.createMarkTeacher(classId, studentId, dto)
  }

  @Post('/monitor/:classId/student/:studentId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Monitor)
  @ApiOperation({
    operationId: 'create-Mark-Monitor',
    description: 'create a Rating Pages',
  })
  async createMarkMonitor(
    @Req() req,
    @Param()
    { classId, studentId }: CreateMarkTeacherParamDto,
    @Body() dto: CreateMarkMonitorDto,
  ) {
    return this.markService.createMarkMonitor(classId, studentId, dto)
  }
}
