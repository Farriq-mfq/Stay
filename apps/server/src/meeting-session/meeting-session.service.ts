import { Inject, Injectable } from '@nestjs/common';
import { CreateMeetingSessionDto } from './dto/create-meeting-session.dto';
import { UpdateMeetingSessionDto } from './dto/update-meeting-session.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/prisma.extension';

@Injectable()
export class MeetingSessionService {
  constructor(
    @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) { }
  async create(createMeetingSessionDto: CreateMeetingSessionDto) {
    return await this.prismaService.client.meeting_sessions.create({
      data: createMeetingSessionDto
    })
  }

  async findAll(page?: number, limit?: number, search?: string) {
    const [items, meta] = await this.prismaService.client.meeting_sessions.paginate({
      where: {
        name: {
          contains: search,
          mode: "insensitive"
        }
      },
      include: {
        presence_sessions: true
      }
    }).withPages({
      limit: limit ?? 10,
      includePageCount: true,
      page: page ?? 1
    });
    return {
      items,
      meta
    }
  }

  async findOne(id: number) {
    return await this.prismaService.client.meeting_sessions.findUniqueOrThrow({
      where: {
        id
      }
    });
  }

  async update(id: number, updateMeetingSessionDto: UpdateMeetingSessionDto) {
    await this.prismaService.client.meeting_sessions.findFirstOrThrow({
      where: {
        id
      }
    })
    return await this.prismaService.client.meeting_sessions.update({
      data: updateMeetingSessionDto,
      where: {
        id
      }
    });
  }

  async remove(id: number) {
    const meetingSession = await this.prismaService.client.meeting_sessions.findFirstOrThrow({
      where: {
        id
      },
      include: {
        presence_sessions: true
      }
    })

    if (meetingSession.presence_sessions) {
      await this.prismaService.client.presence_sessions.update({
        where: {
          id: meetingSession.presence_sessions.id
        },
        data: {
          meeting_sessionsId: null
        }
      })
    }
    
    return await this.prismaService.client.meeting_sessions.delete({
      where: {
        id
      }
    })
  }

  async selectedMeetingSession(sessionId: number, meetingSessionId: number) {
    const session = await this.prismaService.client.presence_sessions.findUniqueOrThrow({
      where: {
        id: sessionId,
        session_role_type: 'PEGAWAI'
      }
    })

    const meetingSession = await this.prismaService.client.meeting_sessions.findUniqueOrThrow({
      where: {
        id: meetingSessionId
      },
      include: {
        presence_sessions: true
      }
    })

    if (meetingSession.presence_sessions) {
      await this.prismaService.client.presence_sessions.update({
        where: {
          id: meetingSession.presence_sessions.id,
        },
        data: {
          meeting_sessionsId: null
        }
      })
    }

    return await this.prismaService.client.presence_sessions.update({
      where: {
        id: session.id,
      },
      data: {
        meeting_sessionsId: meetingSession.id
      }
    })
  }
  async unSelectedMeetingSession(sessionId: number, meetingSessionId: number) {
    const session = await this.prismaService.client.presence_sessions.findUniqueOrThrow({
      where: {
        id: sessionId,
        session_role_type: 'PEGAWAI'
      }
    })

    const meetingSession = await this.prismaService.client.meeting_sessions.findUniqueOrThrow({
      where: {
        id: meetingSessionId
      },
      include: {
        presence_sessions: true
      }
    })

    return await this.prismaService.client.presence_sessions.update({
      where: {
        id: session.id,
        meeting_sessionsId: meetingSession.id
      },
      data: {
        meeting_sessionsId: null
      }
    })
  }
}
