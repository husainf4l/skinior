import { SetMetadata } from '@nestjs/common';

export const ADMIN_KEY = 'admin';
export const AdminOnly = () => SetMetadata(ADMIN_KEY, true);