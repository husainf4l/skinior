import { useState, useEffect } from 'react';
import { DashboardService, DashboardOverviewData } from '@/services/dashboardService';

// Dashboard Overview Hook
export const useDashboardOverview = (range: '7d' | '30d' | '90d' = '7d') => {
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await DashboardService.getDashboardOverview(range);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      if (err instanceof Error && err.message === 'UNAUTHORIZED') {
        // Handle unauthorized access
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range]);

  return { data, loading, error, refetch: fetchData };
};

// Treatments Hook
export const useTreatments = () => {
  const [treatments, setTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTreatments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await DashboardService.getTreatments();
      setTreatments(response.treatments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      if (err instanceof Error && err.message === 'UNAUTHORIZED') {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatments();
  }, []);

  const createTreatment = async (treatmentData: any) => {
    try {
      const response = await DashboardService.createTreatment(treatmentData);
      // Refresh the list
      await fetchTreatments();
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create treatment');
      throw err;
    }
  };

  const updateTreatment = async (id: string, updateData: any) => {
    try {
      const response = await DashboardService.updateTreatment(id, updateData);
      // Refresh the list
      await fetchTreatments();
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update treatment');
      throw err;
    }
  };

  return {
    treatments,
    loading,
    error,
    createTreatment,
    updateTreatment,
    refetch: fetchTreatments,
  };
};

// Consultations Hook
export const useConsultations = (limit?: number) => {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchConsultations = async (cursor?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await DashboardService.getConsultations(limit, cursor);
      setConsultations(response.consultations || []);
      setPagination(response.pagination || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      if (err instanceof Error && err.message === 'UNAUTHORIZED') {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, [limit]);

  const createFollowUp = async (consultationId: string, followUpData: any) => {
    try {
      const response = await DashboardService.createFollowUp(consultationId, followUpData);
      // Refresh the list
      await fetchConsultations();
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create follow-up');
      throw err;
    }
  };

  return {
    consultations,
    loading,
    error,
    pagination,
    createFollowUp,
    refetch: fetchConsultations,
    loadMore: () => fetchConsultations(pagination?.cursor),
  };
};

// Error handling utility
export const handleApiError = (error: any, showToast?: (message: string, type: 'error' | 'success') => void) => {
  const message = error?.message || 'An unexpected error occurred';
  
  switch (error?.statusCode) {
    case 401:
      // Redirect to login
      window.location.href = '/login';
      break;
    case 403:
      showToast?.('You do not have permission to perform this action', 'error');
      break;
    case 404:
      showToast?.('Resource not found', 'error');
      break;
    case 500:
      showToast?.('An unexpected error occurred. Please try again.', 'error');
      break;
    default:
      showToast?.(message, 'error');
  }
};
