import { Global, Module } from "@nestjs/common";
import { CloudinaryService } from "./cloudinary.service";
import { TokenService } from "./token.service";
@Global()
@Module({
    providers: [TokenService, CloudinaryService],
    exports: [TokenService, CloudinaryService]
})
export class ServicesModule { }