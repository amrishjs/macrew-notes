import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalStorageService } from '../src/services/storage';
import { Note } from '../src/types/notes';

jest.mock('@react-native-async-storage/async-storage');

describe('LocalStorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNotes', () => {
    it('should return empty array when no notes exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const notes = await LocalStorageService.getNotes();

      expect(notes).toEqual([]);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        'notes_offline_storage',
      );
    });

    it('should return filtered notes (excluding deleted)', async () => {
      const mockNotes: Note[] = [
        {
          id: '1',
          localId: 'local-1',
          title: 'Active Note',
          description: 'Description',
          createdAt: new Date(),
          updatedAt: new Date(),
          isSync: true,
          isDeleted: false,
        },
        {
          id: '2',
          localId: 'local-2',
          title: 'Deleted Note',
          description: 'Description',
          createdAt: new Date(),
          updatedAt: new Date(),
          isSync: true,
          isDeleted: true,
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockNotes),
      );

      const notes = await LocalStorageService.getNotes();

      expect(notes).toHaveLength(1);
      expect(notes[0].title).toBe('Active Note');
    });
  });

  describe('saveNote', () => {
    it('should add new note to existing notes', async () => {
      const existingNotes: Note[] = [];
      const newNote: Note = {
        id: '1',
        localId: 'local-1',
        title: 'New Note',
        description: 'Description',
        createdAt: new Date(),
        updatedAt: new Date(),
        isSync: false,
        isDeleted: false,
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingNotes),
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await LocalStorageService.saveNote(newNote);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'notes_offline_storage',
        expect.stringContaining('"title":"New Note"'),
      );
    });
  });
});
