import { IsLatitude, IsLongitude, IsNotEmpty, IsNumber } from "class-validator";

export class PresenceLocationDto {
    @IsNumber()
    @IsNotEmpty({
        message: "Latitude tidak boleh kosong"
    })
    @IsLatitude({
        message: "Latitude tidak valid"
    })
    latitude: number;
    @IsNumber()
    @IsLongitude({
        message: "Longitude tidak valid"
    })
    @IsNotEmpty({
        message: "Longitude tidak boleh kosong"
    })
    longitude: number;
}