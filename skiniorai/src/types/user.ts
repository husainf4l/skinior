/**
 * User interface matching the Prisma User model
 * This should be kept in sync with the backend User model
 */
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string; // ISO string format from API
  updatedAt: string; // ISO string format from API
}

/**
 * User data for registration (without system fields)
 */
export interface CreateUser {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

/**
 * User data for updates (excluding system fields)
 */
export interface UpdateUser {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

/**
 * User profile display data (excluding sensitive fields)
 */
export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: string;
  createdAt: string;
}

/**
 * Utility function to get full name
 */
export function getUserFullName(user: User | UserProfile): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user.firstName) {
    return user.firstName;
  }
  if (user.lastName) {
    return user.lastName;
  }
  return user.email.split('@')[0]; // Fallback to email username
}

/**
 * Utility function to get display name
 */
export function getUserDisplayName(user: User | UserProfile): string {
  return getUserFullName(user);
}

/**
 * User roles enum
 */
export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin'
}