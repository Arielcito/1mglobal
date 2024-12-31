export interface Class {
    classId: number;
    courseId: number;
    title: string;
    description: string;
    scheduledAt?: string | null;
    isLive: boolean;
    recordingUrl?: string | null;
    content?: string | null;
    createdAt: string;
    duration?: number | null;
    order: number;
    publishedAt?: string | null;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    updatedAt: string;
  }
  
  export enum ClassStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED'
  }
  
  export interface CreateClassDto {
    courseId: number;
    title: string;
    description: string;
    scheduledAt?: string;
    isLive?: boolean;
    recordingUrl?: string;
    content?: string;
    duration?: number;
    order: number;
  }
  
  export interface UpdateClassDto {
    title?: string;
    description?: string;
    scheduledAt?: string;
    isLive?: boolean;
    recordingUrl?: string;
    content?: string;
    duration?: number;
    order?: number;
    status?: ClassStatus;
  } 