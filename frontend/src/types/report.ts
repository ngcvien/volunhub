import { User } from './user';
import { Event } from './event';

export enum ReportType {
    INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
    SPAM = 'SPAM',
    HARASSMENT = 'HARASSMENT',
    FAKE_EVENT = 'FAKE_EVENT',
    OTHER = 'OTHER'
}

export enum ReportStatus {
    PENDING = 'PENDING',
    REVIEWING = 'REVIEWING',
    RESOLVED = 'RESOLVED',
    REJECTED = 'REJECTED'
}

export interface Report {
    id: number;
    reporterId: number;
    reportedEventId: number;
    type: ReportType;
    description: string;
    status: ReportStatus;
    adminNote?: string;
    createdAt: string;
    updatedAt: string;
    reporter?: User;
    reportedEvent?: Event;
}

export interface PaginatedReports {
    reports: Report[];
    totalPages: number;
    currentPage: number;
    totalReports: number;
} 