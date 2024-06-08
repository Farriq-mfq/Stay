import { PartialType } from '@nestjs/mapped-types';
import { CreateGatewayDto } from './create-gateway.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateGatewayDto extends PartialType(CreateGatewayDto) {
    @IsBoolean()
    @IsOptional()
    status: boolean
}
