import { useState, useEffect, useCallback } from 'react';
import { DashboardService, DashboardOverviewData, CreateTreatmentData, UpdateTreatmentData, CreateFollowUpData } from '@/services/dashboardService';
import { Treatment, ConsultationListItem } from '@/types';

// Dashboard Overview Hook
export const useDashboardOverview = (range: '7d' | '30d' | '90d' = '7d') => {
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
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
  }, [range]);

  useEffect(() => {
    fetchData();
  }, [range, fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Treatments Hook
export const useTreatments = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTreatments = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchTreatments();
  }, [fetchTreatments]);

  const createTreatment = async (treatmentData: CreateTreatmentData) => {
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

  const updateTreatment = async (id: string, updateData: UpdateTreatmentData) => {
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
  const [consultations, setConsultations] = useState<ConsultationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{ total: number; page: number; limit: number; cursor?: string } | null>(null);

  const fetchConsultations = useCallback(async (cursor?: string) => {
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
  }, [limit]);

  useEffect(() => {
    fetchConsultations();
  }, [limit, fetchConsultations]);

  const createFollowUp = async (consultationId: string, followUpData: CreateFollowUpData) => {
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
export const handleApiError = (error: unknown, showToast?: (message: string, type: 'error' | 'success') => void) => {
  const errorObj = error as { message?: string; statusCode?: number };
  const message = errorObj?.message || 'An unexpected error occurred';
  
  switch (errorObj?.statusCode) {
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
