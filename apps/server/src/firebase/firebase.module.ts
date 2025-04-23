import { Global, Module } from "@nestjs/common";
import * as admin from 'firebase-admin';
import * as path from 'path';
@Global()
@Module({
    providers: [
        {
            provide: 'FIREBASE_ADMIN',
            useFactory: () => {
                const serviceAccountPath = path.resolve(__dirname, '..', '..', '..', 'serviceAccountKey.json');
                return admin.initializeApp({
                    credential: admin.credential.cert(serviceAccountPath),
                });
            }
        }
    ]
    ,
    exports: ['FIREBASE_ADMIN']
})
export class FirebaseModule {

}