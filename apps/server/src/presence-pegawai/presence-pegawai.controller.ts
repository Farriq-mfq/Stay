import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@Controller('presence-pegawai')
@ApiTags('prensence-pegawai')
export class PresencePegawaiController {
    async findAll() {
        return "ok"
    }

    async findByMeetingSession() { }

    async exportAll() { }

    async exportByMeetingSession() { }
}