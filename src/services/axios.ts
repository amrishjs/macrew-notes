import axios from 'axios';
import { CreateNoteRequest, Note, UpdateNoteRequest } from '../types/notes';

const BASE_URL = 'BASE_URL_HERE';
export const IMAGE_BASE_URL = 'BASE_URL_HERE';

export const ApiService = {
  BASE_URL: BASE_URL,

  async getNotes(): Promise<Note[]> {
    try {
      const response = await axios.get(BASE_URL!, {
        headers: { Accept: 'application/json' },
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching notes from API:', error);
      throw error;
    }
  },

  async createNote(noteData: CreateNoteRequest): Promise<Note> {
    try {
      const formData = new FormData();
      formData.append('title', noteData.title);
      formData.append('description', noteData.description);

      if (noteData.image) {
        formData.append('image', {
          uri: noteData.image,
          type: 'image/jpeg',
          name: 'note_image.jpg',
        } as any);
      }

      if (noteData.id) {
        formData.append('id', noteData.id);
      }

      const response = await axios.post(BASE_URL!, formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  },

  async updateNote(noteData: UpdateNoteRequest): Promise<Note> {
    try {
      const formData = new FormData();
      formData.append('title', noteData.title);
      formData.append('description', noteData.description);
      formData.append('id', noteData.id);

      if (noteData.image) {
        formData.append('image', {
          uri: noteData.image,
          type: 'image/jpeg',
          name: 'note_image.jpg',
        } as any);
      }

      const response = await axios.post(`${this.BASE_URL}/update`, formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  },

  async deleteNote(id: string): Promise<void> {
    try {
      await axios.delete(`${this.BASE_URL}?id=${id}`, {
        headers: { Accept: 'application/json' },
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  },
};
