import { ApiService } from './apiService';

export interface DashboardOverviewData {
  personalStats: {
    myConsultations: number;
    myActiveTreatments: number;
    skinImprovementRate: number;
    avgImprovementScore: number;
  };
  myActiveTreatments: Array<{
    id: string;
    name: string;
    progress: number;
    status: string;
    startDate?: string;
    currentWeek?: number;
    nextMilestone?: string;
  }>;
  myRecentConsultations: Array<{
    id: string;
    customerName?: string;
    concerns?: string[];
    createdAt: string;
    status: string;
    analysisType?: string;
  }>;
  recommendedProductsCount: number;
  favoritesCount: number;
  myCollectionValue: number;
}

export interface CreateTreatmentData {
  name: string;
  startDate: string;
  durationWeeks: number;
  milestones?: string[];
}

export interface UpdateTreatmentData {
  progressPercent?: number;
  status?: 'active' | 'paused' | 'completed' | 'cancelled';
  completeMilestoneId?: string;
}

export interface CreateFollowUpData {
  type: 'appointment' | 'note';
  scheduledAt?: string;
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
}

export class DashboardService {
  // Dashboard Overview
  static async getDashboardOverview(range: '7d' | '30d' | '90d' = '7d'): Promise<DashboardOverviewData> {
    const response = await ApiService.authenticatedFetch(`/dashboard/overview?range=${range}`);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error('Failed to fetch dashboard overview');
    }

    const result = await response.json();
    return result.data;
  }

  // Treatments
  static async getTreatments() {
    const response = await ApiService.authenticatedFetch('/treatments');
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error('Failed to fetch treatments');
    }

    const result = await response.json();
    return result.data;
  }

  static async createTreatment(data: CreateTreatmentData) {
    const response = await ApiService.authenticatedFetch('/treatments', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error('Failed to create treatment');
    }

    const result = await response.json();
    return result.data;
  }

  static async updateTreatment(id: string, data: UpdateTreatmentData) {
    const response = await ApiService.authenticatedFetch(`/treatments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error('Failed to update treatment');
    }

    const result = await response.json();
    return result.data;
  }

  static async getTreatmentMilestones(id: string) {
    const response = await ApiService.authenticatedFetch(`/treatments/${id}/milestones`);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error('Failed to fetch treatment milestones');
    }

    const result = await response.json();
    return result.data;
  }

  // Consultations
  static async getConsultations(limit?: number, cursor?: string) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (cursor) params.append('cursor', cursor);

    const response = await ApiService.authenticatedFetch(`/consultations?${params}`);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error('Failed to fetch consultations');
    }

    const result = await response.json();
    return result.data;
  }

  static async getConsultationDetails(id: string) {
    const response = await ApiService.authenticatedFetch(`/consultations/${id}`);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error('Failed to fetch consultation details');
    }

    const result = await response.json();
    return result.data;
  }

  static async createFollowUp(consultationId: string, data: CreateFollowUpData) {
    const response = await ApiService.authenticatedFetch(`/consultations/${consultationId}/follow-up`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error('Failed to create follow-up');
    }

    const result = await response.json();
    return result.data;
  }
}
