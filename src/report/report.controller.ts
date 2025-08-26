import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportService } from './report.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/currentUser';
import { User } from 'src/user/user.entity';
import { Serialize } from 'src/decorators/serialize.decorator';
import { ReportDto } from './dtos/report.dto';
import { ApprovedReportDto } from './dtos/approved-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('report')
@Serialize(ReportDto)
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Get()
  getEstimate(@Query() qurey: GetEstimateDto) {
    return this.reportService.createEstimate(qurey);
  }

  @UseGuards(AuthGuard)
  @Post()
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportService.create(body, user);
  }

  @UseGuards(AdminGuard)
  @Patch('/:id')
  approvedReport(@Param('id') id: string, @Body() body: ApprovedReportDto) {
    return this.reportService.changeApproval(parseInt(id), body);
  }
}
