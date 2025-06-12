export enum ReportStatus {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED'
}

export enum ReportType {
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  SPAM = 'SPAM',
  HARASSMENT = 'HARASSMENT',
  FAKE_EVENT = 'FAKE_EVENT',
  OTHER = 'OTHER'
}

export interface Report {
  id: number;
  reporterId: number;
  reportedEventId: number;
  type: ReportType;
  description: string;
  status: ReportStatus;
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;
  reporter?: any; // Will be populated with User data
  reportedEvent?: any; // Will be populated with Event data
} 