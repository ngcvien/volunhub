import { Report, ReportType, ReportStatus } from '../models/Report.model';
import { Event, EventStatus } from '../models/Event.model';
import { User } from '../models/User.model';
import { Op } from 'sequelize';

interface CreateReportInput {
    reporterId: number;
    reportedEventId: number;
    type: ReportType;
    description: string;
}

interface GetReportsOptions {
    page?: number;
    limit?: number;
    status?: ReportStatus;
    type?: ReportType;
}

interface PaginatedReportsResult {
    reports: any[];
    totalPages: number;
    currentPage: number;
    totalReports: number;
}

class ReportService {
    async createReport(data: CreateReportInput): Promise<Report> {
        // Kiểm tra xem người dùng đã báo cáo sự kiện này chưa
        const existingReport = await Report.findOne({
            where: {
                reporterId: data.reporterId,
                reportedEventId: data.reportedEventId,
                status: {
                    [Op.notIn]: [ReportStatus.REJECTED, ReportStatus.RESOLVED]
                }
            }
        });

        if (existingReport) {
            throw new Error('Bạn đã báo cáo sự kiện này trước đó.');
        }

        return Report.create(data);
    }

    async getReports(options: GetReportsOptions): Promise<PaginatedReportsResult> {
        const { page = 1, limit = 10, status, type } = options;
        const offset = (page - 1) * limit;

        const whereClause: any = {};
        if (status) whereClause.status = status;
        if (type) whereClause.type = type;

        const { count, rows } = await Report.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'reporter',
                    attributes: ['id', 'username', 'avatarUrl']
                },
                {
                    model: Event,
                    as: 'reportedEvent',
                    attributes: ['id', 'title', 'status']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            distinct: true
        });

        return {
            reports: rows,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalReports: count
        };
    }

    async updateReportStatus(reportId: number, status: ReportStatus, adminNote?: string): Promise<Report> {
        const report = await Report.findByPk(reportId);
        if (!report) {
            throw new Error('Không tìm thấy báo cáo.');
        }

        report.status = status;
        if (adminNote) report.adminNote = adminNote;

        // Nếu báo cáo được xác nhận là vi phạm
        if (status === ReportStatus.RESOLVED) {
            const event = await Event.findByPk(report.reportedEventId);
            if (event) {
                event.status = EventStatus.REJECTED;
                await event.save();
            }
        }

        await report.save();
        return report;
    }

    async getReportById(reportId: number): Promise<Report | null> {
        return Report.findByPk(reportId, {
            include: [
                {
                    model: User,
                    as: 'reporter',
                    attributes: ['id', 'username', 'avatarUrl']
                },
                {
                    model: Event,
                    as: 'reportedEvent',
                    attributes: ['id', 'title', 'description', 'status', 'creatorId']
                }
            ]
        });
    }

    async getReportsByEvent(eventId: number): Promise<Report[]> {
        return Report.findAll({
            where: { reportedEventId: eventId },
            include: [
                {
                    model: User,
                    as: 'reporter',
                    attributes: ['id', 'username', 'avatarUrl']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
    }
}

export default new ReportService(); 