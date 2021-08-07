import { Body, Controller, Param, Patch, Post, UseGuards, Get, Query } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard'
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize, SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report-dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {

    constructor(
        private reportsService: ReportsService
    ) {}


    @Get('/estimate')
    getEstimate(@Query() query: GetEstimateDto) {
        return this.reportsService.createEstimate(query)
    }
   
    @Post()
    @Serialize(ReportDto)
    @UseGuards(AuthGuard)
    async createReport(@CurrentUser() currentUser: User, @Body() body: CreateReportDto) {    
        const report = await this.reportsService.create(currentUser, body)                
        console.log(report)
        return report
    }

    
    @Patch(':id')
    @UseGuards(AdminGuard)
    @Serialize(ReportDto)    
    async approveReport(@Param('id') id: number, @Body() body: ApproveReportDto) {
        return await this.reportsService.changeApproval(id, body.approved)
    }
}
