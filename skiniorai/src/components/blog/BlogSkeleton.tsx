'use client';

interface BlogSkeletonProps {
  variant?: 'card' | 'featured' | 'post' | 'list';
  count?: number;
}

export default function BlogSkeleton({ variant = 'card', count = 6 }: BlogSkeletonProps) {
  if (variant === 'featured') {
    return (
      <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 animate-pulse">
        <div className="lg:flex lg:items-center">
          <div className="lg:w-3/5">
            <div className="h-96 lg:h-[600px] bg-gray-200"></div>
          </div>
          <div className="lg:w-2/5 p-8 lg:p-12 lg:pl-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-3 mb-6">
              <div className="h-8 bg-gray-200 rounded w-full"></div>
              <div className="h-8 bg-gray-200 rounded w-4/5"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="space-y-2 mb-8">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-11/12"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-3 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="h-12 w-32 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'post') {
    return (
      <div className="min-h-screen bg-white animate-pulse">
        {/* Breadcrumb Skeleton */}
        <nav className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="h-4 w-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        </nav>

        {/* Hero Section Skeleton */}
        <section className="bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-4 mb-6">
                <div className="h-12 bg-gray-200 rounded w-full mx-auto"></div>
                <div className="h-12 bg-gray-200 rounded w-4/5 mx-auto"></div>
                <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
              <div className="space-y-3 mb-8 max-w-3xl mx-auto">
                <div className="h-6 bg-gray-200 rounded w-full"></div>
                <div className="h-6 bg-gray-200 rounded w-11/12 mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded w-4/5 mx-auto"></div>
              </div>
              
              <div className="flex items-center justify-center gap-8 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                  <div className="text-left space-y-2">
                    <div className="h-5 w-32 bg-gray-200 rounded"></div>
                    <div className="h-4 w-40 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <div className="h-4 w-8 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <div className="h-4 w-8 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <div className="h-4 w-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="h-96 lg:h-[500px] bg-gray-200 rounded-3xl"></div>
          </div>
        </section>

        {/* Content Skeleton */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-11/12"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </article>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-6 animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex gap-6 p-6 bg-white rounded-xl border border-gray-100">
            <div className="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0"></div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="h-3 w-20 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-full"></div>
                <div className="h-6 bg-gray-200 rounded w-4/5"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-11/12"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default card variant
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 animate-pulse"
        >
          <div className="h-60 bg-gray-200"></div>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-3 mb-3">
              <div className="h-5 bg-gray-200 rounded w-full"></div>
              <div className="h-5 bg-gray-200 rounded w-4/5"></div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-11/12"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Individual skeleton components for specific use cases
export function BlogHeroSkeleton() {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-white overflow-hidden animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center">
          <div className="h-16 bg-gray-200 rounded w-2/3 mx-auto mb-8"></div>
          <div className="space-y-3 mb-12 max-w-4xl mx-auto">
            <div className="h-6 bg-gray-200 rounded w-full"></div>
            <div className="h-6 bg-gray-200 rounded w-5/6 mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded w-4/5 mx-auto"></div>
          </div>
          
          {/* Search Bar Skeleton */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="h-16 bg-gray-200 rounded-2xl"></div>
          </div>

          {/* Category Filter Skeleton */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 w-20 bg-gray-200 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function BlogSearchSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
      <BlogSkeleton variant="list" count={5} />
    </div>
  );
}

export function CommentsLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-3 w-20 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-4 w-12 bg-gray-200 rounded"></div>
                <div className="h-4 w-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
