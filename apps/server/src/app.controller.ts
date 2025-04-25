import { Controller, Get, Res } from "@nestjs/common";
import { PDFService } from "@t00nday/nestjs-pdf";
import { Response } from "express";
import { tap } from "rxjs";


/**
 * TODO : REMOVE THIS CONTROLLER
 * ITS JUST TESING
 */
@Controller()
export class AppController {
    constructor(
        private readonly pdfService: PDFService
    ) {

    }
    @Get('/test')
    getHello(
        @Res() res: Response
    ) {
        return this.pdfService.toBuffer('presence/personal', {
            locals: {
                now: new Date()
            }
        }).pipe(
            tap((pdfbuffer: Buffer) => {
                res.set({
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename="file.pdf"',
                    'Content-Length': pdfbuffer.length,
                });

                res.end(pdfbuffer);
            })
        );
    }
}