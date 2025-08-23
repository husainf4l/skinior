export interface SkinAnalysis {
  [key: string]: number | string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Consultation {
  id: string;
  analysisType: string;
  status: 'completed' | 'in_progress' | 'pending' | 'cancelled';
  createdAt: string;
  duration?: number;
  advisorName?: string;
  concerns?: string[];
  notes?: string;
  improvementScore?: number;
  skinAnalysis?: SkinAnalysis;
  recommendations?: Recommendation[];
}

export interface ConsultationListItem {
  id: string;
  title: string;
  type: string;
  status: 'completed' | 'in_progress' | 'pending' | 'cancelled';
  date: string;
  advisor: string;
  notes?: string;
  improvementScore?: number;
  analysisType?: string;
  createdAt?: string;
  concerns?: string[];
  recommendations?: Array<string | { title: string }>;
  skinAnalysis?: Record<string, unknown>;
  duration?: number;
  advisorName?: string;
}