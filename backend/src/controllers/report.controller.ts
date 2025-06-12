import { Request, Response, NextFunction } from 'express';
import reportService from '../services/report.service';
import { ReportStatus, ReportType } from '../models/Report.model';
import { PrismaClient } from '';

const prisma = new PrismaClient();

class ReportController {
    async createReport(req: Request, res: Response, next: NextFunction) {
        try {
            const { reportedEventId, type, description } = req.body;
            const reporterId = req.user?.id;

            if (!reporterId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const report = await prisma.report.create({
                data: {
                    reporterId,
                    reportedEventId,
                    type,
                    description,
                    status: ReportStatus.PENDING
                },
                include: {
                    reporter: true,
                    reportedEvent: true
                }
            });

            res.status(201).json({ report });
        } catch (error) {
            console.error('Error creating report:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getReports(req: Request, res: Response, next: NextFunction) {
        try {
            const reports = await prisma.report.findMany({
                include: {
                    reporter: true,
                    reportedEvent: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            res.json({ reports });
        } catch (error) {
            console.error('Error fetching reports:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateReportStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { status, adminNote } = req.body;

            const report = await prisma.report.update({
                where: { id: Number(id) },
                data: {
                    status,
                    adminNote
                },
                include: {
                    reporter: true,
                    reportedEvent: true
                }
            });

            res.json({ report });
        } catch (error) {
            console.error('Error updating report:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getReportById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const report = await prisma.report.findUnique({
                where: { id: Number(id) },
                include: {
                    reporter: true,
                    reportedEvent: true
                }
            });

            if (!report) {
                return res.status(404).json({ message: 'Report not found' });
            }

            res.json({ report });
        } catch (error) {
            console.error('Error fetching report:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getReportsByEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const { eventId } = req.params;
            const reports = await reportService.getReportsByEvent(parseInt(eventId));
            res.json(reports);
        } catch (error) {
            next(error);
        }
    }

    async deleteReport(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await prisma.report.delete({
                where: { id: Number(id) }
            });

            res.json({ message: 'Report deleted successfully' });
        } catch (error) {
            console.error('Error deleting report:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default new ReportController(); 