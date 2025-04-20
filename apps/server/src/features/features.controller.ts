import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, UseGuards } from "@nestjs/common";
import { FeaturesService } from "./features.service";
import { Permissions } from "src/decorators/permission.decorator";
import { AccessTokenGuard } from "src/guards/accessToken.guard";
import { PermissionGuard } from "src/guards/permissions.guard";
import { FeatureUpdateDto } from "./dto/features.dto";

@Controller('features')
@UseGuards(AccessTokenGuard, PermissionGuard)
export class FeaturesController {
    constructor(
        private readonly featuresService: FeaturesService
    ) {

    }

    @Get()
    @Permissions('features:read')
    async findAll(
        @Query('page', new ParseIntPipe({ optional: true })) page?: number,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
        @Query('search') search?: string,
    ) {
        return await this.featuresService.findAll(page, limit, search);
    }

    @Patch(':id')
    @Permissions('features:update')
    async updateFeature(
        @Param('id', new ParseIntPipe()) id: number,
        @Body() featureUpdateDto: FeatureUpdateDto
    ) {
        return await this.featuresService.update(id, featureUpdateDto);
    }
}