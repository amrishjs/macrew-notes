import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types/notes';

export const LocalStorageService = {
  NOTES_KEY: 'notes_offline_storage',
  SYNC_QUEUE_KEY: 'sync_queue',

  async getNotes(): Promise<Note[]> {
    try {
      const notesJson = await AsyncStorage.getItem(this.NOTES_KEY);
      if (!notesJson) return [];

      const notes: Note[] = JSON.parse(notesJson);
      return notes.filter(note => !note.isDeleted);
    } catch (error) {
      console.error('Error getting notes from local storage:', error);
      return [];
    }
  },

  async getAllNotes(): Promise<Note[]> {
    try {
      const notesJson = await AsyncStorage.getItem(this.NOTES_KEY);
      if (!notesJson) return [];
      return JSON.parse(notesJson);
    } catch (error) {
      console.error('Error getting all notes from local storage:', error);
      return [];
    }
  },

  async saveNote(note: Note): Promise<void> {
    try {
      const existingNotes = await this.getAllNotes();
      const noteIndex = existingNotes.findIndex(
        n => n.localId === note.localId,
      );

      if (noteIndex >= 0) {
        existingNotes[noteIndex] = { ...note, updatedAt: new Date() };
      } else {
        existingNotes.push({
          ...note,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      await AsyncStorage.setItem(this.NOTES_KEY, JSON.stringify(existingNotes));
    } catch (error) {
      console.error('Error saving note to local storage:', error);
      throw error;
    }
  },

  async deleteNote(localId: string): Promise<void> {
    try {
      const existingNotes = await this.getAllNotes();
      const updatedNotes = existingNotes.map(note =>
        note.localId === localId
          ? { ...note, isDeleted: true, updatedAt: new Date() }
          : note,
      );

      await AsyncStorage.setItem(this.NOTES_KEY, JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Error deleting note from local storage:', error);
      throw error;
    }
  },

  async addToSyncQueue(
    operation: 'create' | 'update' | 'delete',
    note: Note,
  ): Promise<void> {
    try {
      const queueJson = await AsyncStorage.getItem(this.SYNC_QUEUE_KEY);
      const queue = queueJson ? JSON.parse(queueJson) : [];

      queue.push({
        operation,
        note,
        timestamp: new Date().toISOString(),
      });

      await AsyncStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Error adding to sync queue:', error);
    }
  },

  async getSyncQueue(): Promise<any[]> {
    try {
      const queueJson = await AsyncStorage.getItem(this.SYNC_QUEUE_KEY);
      return queueJson ? JSON.parse(queueJson) : [];
    } catch (error) {
      console.error('Error getting sync queue:', error);
      return [];
    }
  },

  async clearSyncQueue(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.SYNC_QUEUE_KEY);
    } catch (error) {
      console.error('Error clearing sync queue:', error);
    }
  },
};
