// import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
// import { ApiBody, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
// import { CreateWASessionDto } from "./dto/create-session.dto";
// import { WhatsappService } from "./whatsapp.service";

// @ApiTags('Whatsapp Service')
// @Controller('/whatsapp')
// export class WhatsappController {

//     constructor(
//         private readonly whatsappService: WhatsappService,
//     ) { }


//     @Post('/create-session')
//     @ApiBody({
//         type: CreateWASessionDto,
//         description: 'Create a new session',
//         required: true
//     })
//     @ApiResponse({ status: 201, description: "OK" })
//     @ApiResponse({ status: 400, description: "Bad Request" })
//     @ApiResponse({ status: 500, description: "Internal Server Error" })
//     async createSession(
//         @Body() createSessionDto: CreateWASessionDto
//     ) {
//         return await this.whatsappService.createSession(createSessionDto)
//     }
//     @Post('/start-session/:sessionId')
//     @ApiParam({
//         name: 'sessionId',
//         type: 'string',
//         description: 'Session ID',
//         required: true,
//         example: 1
//     })
//     @ApiResponse({ status: 201, description: "OK" })
//     @ApiResponse({ status: 500, description: "Internal Server Error" })
//     @ApiResponse({ status: 400, description: "Bad Request" })
//     @ApiResponse({ status: 404, description: "Not found" })
//     async startSession(
//         @Param('sessionId', new ParseIntPipe()) sessionId: string
//     ) {
//         return await this.whatsappService.startSession(sessionId)
//     }
//     @Get('/check-session/:sessionId')
//     @ApiParam({
//         name: 'sessionId',
//         type: 'string',
//         description: 'Session ID',
//         required: true,
//         example: 1
//     })
//     @ApiResponse({ status: 200, description: "OK" })
//     @ApiResponse({ status: 404, description: "Not found" })
//     @ApiResponse({ status: 500, description: "Internal Server Error" })
//     async checkSession(
//         @Param('sessionId', new ParseIntPipe()) sessionId: string
//     ) {
//         return await this.whatsappService.checkConnection(sessionId)
//     }
//     @Get('/session-status/:sessionId')
//     @ApiParam({
//         name: 'sessionId',
//         type: 'string',
//         description: 'Session ID',
//         required: true,
//         example: 1
//     })
//     @ApiResponse({ status: 200, description: "OK" })
//     @ApiResponse({ status: 404, description: "Not found" })
//     @ApiResponse({ status: 500, description: "Internal Server Error" })
//     async statusSession(
//         @Param('sessionId', new ParseIntPipe()) sessionId: string
//     ) {
//         return await this.whatsappService.statusSession(sessionId)
//     }
//     @Post('/logout-session/:sessionId')
//     @ApiParam({
//         name: 'sessionId',
//         type: 'string',
//         description: 'Session ID',
//         required: true,
//         example: 1
//     })
//     @ApiResponse({ status: 201, description: "OK" })
//     @ApiResponse({ status: 404, description: "Not found" })
//     @ApiResponse({ status: 500, description: "Internal Server Error" })
//     async logoutSession(
//         @Param('sessionId', new ParseIntPipe()) sessionId: string
//     ) {
//         return await this.whatsappService.logoutSession(sessionId)
//     }
//     @Post('/close-session/:sessionId')
//     @ApiParam({
//         name: 'sessionId',
//         type: 'string',
//         description: 'Session ID',
//         required: true,
//         example: 1
//     })
//     @ApiResponse({ status: 201, description: "OK" })
//     @ApiResponse({ status: 404, description: "Not found" })
//     @ApiResponse({ status: 500, description: "Internal Server Error" })
//     async closeSession(
//         @Param('sessionId', new ParseIntPipe()) sessionId: string
//     ) {
//         return await this.whatsappService.closeSession(sessionId)
//     }

//     @Post('/:sessionId/send-message')
//     @ApiParam({
//         name: 'sessionId',
//         type: 'string',
//         description: 'Session ID',
//         required: true,
//         example: 1
//     })
//     @ApiResponse({ status: 201, description: "OK" })
//     @ApiResponse({ status: 404, description: "Not found" })
//     @ApiResponse({ status: 500, description: "Internal Server Error" })
//     async sendMessage() {
//         return 'ok'
//     }

//     @Get('/list-sessions')
//     @ApiResponse({ status: 200, description: "List of sessions" })
//     @ApiResponse({ status: 404, description: "Not found" })
//     @ApiResponse({ status: 500, description: "Internal Server Error" })
//     async listSession() {
//         return await this.whatsappService.listSessions()
//     }
// }