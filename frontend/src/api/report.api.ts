import axios from 'axios';
import { ReportType, ReportStatus } from '../types/report';

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3001/api';

interface CreateReportInput {
    type: ReportType;
    description: string;
}

interface GetReportsParams {
    page?: number;
    limit?: number;
    status?: ReportStatus;
    type?: ReportType;
}

export const reportEvent = async (eventId: number, data: CreateReportInput) => {
    const response = await axios.post(`${API_URL}/reports`, {
        reportedEventId: eventId,
        ...data
    });
    return response.data;
};

export const getReports = async (params: GetReportsParams = {}) => {
    const response = await axios.get(`${API_URL}/reports`, { params });
    return response.data;
};

export const updateReportStatus = async (reportId: number, status: ReportStatus, adminNote?: string) => {
    const response = await axios.patch(`${API_URL}/reports/${reportId}`, {
        status,
        adminNote
    });
    return response.data;
};

export const getReportById = async (reportId: number) => {
    const response = await axios.get(`${API_URL}/reports/${reportId}`);
    return response.data;
};

export const getReportsByEvent = async (eventId: number) => {
    const response = await axios.get(`${API_URL}/reports/event/${eventId}`);
    return response.data;
}; 