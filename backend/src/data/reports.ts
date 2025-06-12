import { Report, ReportStatus, ReportType } from '../types/report';

// Mảng lưu trữ các báo cáo
let reports: Report[] = [];

// Tạo báo cáo mới
export const createReport = (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Report => {
  const newReport: Report = {
    id: reports.length + 1,
    ...report,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  reports.push(newReport);
  return newReport;
};

// Lấy tất cả báo cáo
export const getAllReports = (): Report[] => {
  return [...reports];
};

// Lấy báo cáo theo ID
export const getReportById = (id: number): Report | undefined => {
  return reports.find(report => report.id === id);
};

// Cập nhật trạng thái báo cáo
export const updateReportStatus = (id: number, status: ReportStatus, adminNote?: string): Report | undefined => {
  const reportIndex = reports.findIndex(report => report.id === id);
  if (reportIndex === -1) return undefined;

  reports[reportIndex] = {
    ...reports[reportIndex],
    status,
    adminNote,
    updatedAt: new Date()
  };

  return reports[reportIndex];
};

// Xóa báo cáo
export const deleteReport = (id: number): boolean => {
  const initialLength = reports.length;
  reports = reports.filter(report => report.id !== id);
  return reports.length !== initialLength;
}; 