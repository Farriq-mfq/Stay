import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    constructor(private readonly configService: ConfigService) {
        cloudinary.config({
            cloudinary_url: this.configService.get<string>('CLOUDINARY_URL'),
        });
    }

    async uploadImage(file: Express.Multer.File,
        folder: string = 'uploads',
        filename: string = null): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            const publicId = filename || file.originalname.split('.')[0];

            cloudinary.uploader.upload_stream(
                {
                    folder,
                    public_id: publicId,
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            ).end(file.buffer);
        });
    }

    async uploadImageFromUrl(imageUrl: string, folder: string = 'uploads', filename: string = null): Promise<any> {
        return new Promise((resolve, reject) => {
            const publicId = filename || imageUrl.split('/').pop().split('.')[0];

            cloudinary.uploader.upload(imageUrl, {
                folder,
                public_id: publicId,
                resource_type: 'auto',
            }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    async deleteImage(publicId: string): Promise<any> {
        return cloudinary.uploader.destroy(publicId);
    }
}
