export interface NotificationResponse {
    success: boolean;
    message: string;
    [key: string]: any;
}

export interface NotificationData {
    id: string;
    title: string;
    body: string;
    data?: any;
    read: boolean;
    createdAt: Date;
    sentAt?: Date;
}

export interface PaginatedNotifications {
    success: boolean;
    notifications: NotificationData[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
