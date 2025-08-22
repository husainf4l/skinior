import React from "react";

interface DashboardSkeletonProps {
  className?: string;
}

export const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 rounded-2xl h-32"></div>
        ))}
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* AI Consultations Skeleton */}
          <div className="bg-gray-200 rounded-2xl h-96"></div>

          {/* Active Treatments Skeleton */}
          <div className="bg-gray-200 rounded-2xl h-80"></div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-8">
          <div className="bg-gray-200 rounded-2xl h-64"></div>
          <div className="bg-gray-200 rounded-2xl h-48"></div>
        </div>
      </div>
    </div>
  );
};

interface StatCardSkeletonProps {
  className?: string;
}

export const StatCardSkeleton: React.FC<StatCardSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
};

interface AppointmentCardSkeletonProps {
  className?: string;
}

export const AppointmentCardSkeleton: React.FC<
  AppointmentCardSkeletonProps
> = ({ className = "" }) => {
  return (
    <div
      className={`flex items-center justify-between p-4 bg-gray-100 rounded-xl animate-pulse ${className}`}
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-28"></div>
        </div>
      </div>
      <div className="text-right">
        <div className="h-6 bg-gray-200 rounded-full w-20 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-12"></div>
      </div>
    </div>
  );
};

interface TreatmentCardSkeletonProps {
  className?: string;
}

export const TreatmentCardSkeleton: React.FC<TreatmentCardSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div className={`p-4 bg-gray-100 rounded-xl animate-pulse ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-28"></div>
    </div>
  );
};

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Something went wrong",
  onRetry,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div className="w-16 h-16 mb-4 rounded-full bg-red-100 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        {icon || (
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
