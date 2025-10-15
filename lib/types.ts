export interface Note {
  _id: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NotesResponse {
  data: {
    notes: Note[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  message: string;
  success: boolean;
}

export interface NoteFormData {
  title: string;
  body: string;
  tags: string[];
}