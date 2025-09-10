export interface Note {
    id: string;
    title: string;
    description: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
    isSync: boolean;
    isDeleted: boolean;
    localId?: string;
  }
  
  export interface CreateNoteRequest {
    title: string;
    description: string;
    image?: File | string;
    id?: string;
  }
  
  export interface UpdateNoteRequest extends CreateNoteRequest {
    id: string;
  }
  
  export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
  }
  