import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EventsGateway } from 'src/events/events.gateway';
import { NotificationDto } from './dto/notification.dto';
import { NotificationApiService } from './notification-api.service';
@Processor('notification-queue')
export class NotificationProcessor extends WorkerHost {
    constructor(
        private readonly notificationService: NotificationApiService,
        private readonly eventsGateway: EventsGateway
    ) {
        super()
    }
    async process(job: Job<NotificationDto & { name: string }>): Promise<any> {
        if (job.name === 'send-notification') {
            return await this.notificationService.sendPushNotification(job.data)
        }
    }


    @OnWorkerEvent('completed')
    async handleCompleted(job: Job) {
        const { data, name } = job;
        if (name === 'send-notification') {
            this.eventsGateway.sendingNotificationEmitStatus(data, 'success')
        }
    }

    @OnWorkerEvent('failed')
    async handleFailed(job: Job) {
        const { data, name } = job;
        if (name === 'send-notification') {
            this.eventsGateway.sendingNotificationEmitStatus(data, 'failed')
        }
    }
}