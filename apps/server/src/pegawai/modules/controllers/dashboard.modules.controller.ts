import { Controller, Get } from "@nestjs/common";

@Controller('pegawai/modules/dashboard')
export class DashboardModulesController {
    @Get('/')
    async getDashboard() {
        return {}
    }
}