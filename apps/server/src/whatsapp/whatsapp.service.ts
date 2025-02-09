// import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import axios from "axios";
// import { CustomPrismaService } from "nestjs-prisma";
// import { ExtendedPrismaClient } from "src/prisma.extension";
// import { TokenService } from "src/services/token.service";
// import { CreateWASessionDto } from "./dto/create-session.dto";

// @Injectable()
// export class WhatsappService {
//     private baseUrl: string
//     constructor(
//         private readonly configService: ConfigService,
//         @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
//         private readonly tokenService: TokenService
//     ) {

//         this.baseUrl = this.configService.get('WHATSAPP_SERVER')
//     }


//     async createSession(createSessionDto: CreateWASessionDto) {
//         const transcation = await this.prismaService.client.$transaction(async (prisma) => {
//             try {

//                 const session = await prisma.whatsapp_sessions.findFirst({
//                     where: {
//                         name: createSessionDto.name,
//                     }
//                 })

//                 if (session) {
//                     throw new BadRequestException("Session Already Exists")
//                 }

//                 const response = await axios.post(`${this.baseUrl}/api/${createSessionDto.name}/${this.configService.get('WHATSAPP_SERVER_SECRETKEY')}/generate-token`)

//                 if (response.status === 201) {
//                     return await prisma.whatsapp_sessions.create({
//                         data: {
//                             name: createSessionDto.name,
//                             token: response.data.token,
//                         }
//                     })

//                 } else {
//                     throw new BadRequestException()
//                 }
//             } catch (e) {
//                 if (e instanceof BadRequestException) {
//                     throw new BadRequestException()
//                 } else {
//                     throw new InternalServerErrorException()
//                 }
//             }
//         })

//         return transcation
//     }

//     async startSession(sessionId: string) {
//         try {

//             const session = await this.prismaService.client.whatsapp_sessions.findUnique({
//                 where: {
//                     id: +sessionId
//                 }
//             })

//             if (!session) throw new NotFoundException()

//             const response = await axios.post(`${this.baseUrl}/api/${session.name}/start-session`, {
//                 "webhook": "",
//                 "waitQrCode": false
//             }, {
//                 headers: {
//                     'Authorization': `Bearer ${session.token}`
//                 }
//             })


//             if (response.data.status === "CONNECTED") {
//                 await this.prismaService.client.whatsapp_sessions.update({
//                     where: {
//                         id: +sessionId
//                     },
//                     data: {
//                         status: "CONNECTED"
//                     }
//                 })
//             }


//             return response.data

//         } catch (e) {
//             if (e instanceof NotFoundException) {
//                 throw new NotFoundException()
//             } else if (e instanceof BadRequestException) {
//                 throw new BadRequestException()
//             } else {
//                 throw new InternalServerErrorException()
//             }
//         }
//     }

//     async checkConnection(sessionId: string) {
//         try {

//             const session = await this.prismaService.client.whatsapp_sessions.findUnique({
//                 where: {
//                     id: +sessionId
//                 }
//             })

//             if (!session) throw new NotFoundException()

//             const response = await axios.get(`${this.baseUrl}/api/${session.name}/check-connection-session`, {
//                 headers: {
//                     'Authorization': `Bearer ${session.token}`
//                 }
//             })

//             return response.data

//         } catch (e) {
//             if (e instanceof NotFoundException) {
//                 throw new NotFoundException()
//             } else {
//                 throw new InternalServerErrorException()
//             }
//         }
//     }
//     async statusSession(sessionId: string) {
//         try {

//             const session = await this.prismaService.client.whatsapp_sessions.findUnique({
//                 where: {
//                     id: +sessionId
//                 }
//             })

//             if (!session) throw new NotFoundException()

//             const response = await axios.get(`${this.baseUrl}/api/${session.name}/status-session`, {
//                 headers: {
//                     'Authorization': `Bearer ${session.token}`
//                 }
//             })


//             if (response.data.status === "CONNECTED") {
//                 await this.prismaService.client.whatsapp_sessions.update({
//                     where: {
//                         id: +sessionId
//                     },
//                     data: {
//                         status: "CONNECTED"
//                     }
//                 })
//             } else {
//                 await this.prismaService.client.whatsapp_sessions.update({
//                     where: {
//                         id: +sessionId
//                     },
//                     data: {
//                         status: "DISCONNECTED"
//                     }
//                 })
//             }
//             return response.data

//         } catch (e) {
//             if (e instanceof NotFoundException) {
//                 throw new NotFoundException()
//             } else {
//                 throw new InternalServerErrorException()
//             }
//         }
//     }
//     async logoutSession(sessionId: string) {
//         try {

//             const session = await this.prismaService.client.whatsapp_sessions.findUnique({
//                 where: {
//                     id: +sessionId
//                 }
//             })

//             if (!session) throw new NotFoundException()

//             const response = await axios.post(`${this.baseUrl}/api/${session.name}/logout-session`, {}, {
//                 headers: {
//                     'Authorization': `Bearer ${session.token}`
//                 }
//             })


//             if (response.data.status) {
//                 await this.prismaService.client.whatsapp_sessions.update({
//                     where: {
//                         id: +sessionId
//                     },
//                     data: {
//                         status: "DISCONNECTED"
//                     }
//                 })
//             }
//             return response.data

//         } catch (e) {
//             if (e instanceof NotFoundException) {
//                 throw new NotFoundException()
//             } else {
//                 throw new InternalServerErrorException()
//             }
//         }
//     }
//     async closeSession(sessionId: string) {
//         try {

//             const session = await this.prismaService.client.whatsapp_sessions.findUnique({
//                 where: {
//                     id: +sessionId
//                 }
//             })

//             if (!session) throw new NotFoundException()

//             const response = await axios.post(`${this.baseUrl}/api/${session.name}/close-session`, {}, {
//                 headers: {
//                     'Authorization': `Bearer ${session.token}`
//                 }
//             })


//             await this.prismaService.client.whatsapp_sessions.update({
//                 where: {
//                     id: +sessionId
//                 },
//                 data: {
//                     status: "INITIALIZED"
//                 }
//             })
//             return response.data

//         } catch (e) {
//             if (e instanceof NotFoundException) {
//                 throw new NotFoundException()
//             } else {
//                 throw new InternalServerErrorException()
//             }
//         }
//     }

//     async listSessions() {
//         return await this.prismaService.client.whatsapp_sessions.findMany()
//     }
// }