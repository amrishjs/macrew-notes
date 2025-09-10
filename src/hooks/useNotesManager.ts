import { useState, useEffect, useCallback } from 'react';
import { CreateNoteRequest, Note } from '../types/notes';
import { LocalStorageService } from '../services/storage';
import { ApiService } from '../services/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateUUID } from '../utils/helpers';
import NetInfo from '@react-native-community/netinfo';
 

export const useNotesManager = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkType, setNetworkType] = useState<string>('unknown');


  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initializeNetworkState = async () => {
      try {
        const state = await NetInfo.fetch();
        setIsOnline(!!state.isConnected && !!state.isInternetReachable);
        setNetworkType(state.type || 'unknown');

        unsubscribe = NetInfo.addEventListener(state => {
          const connected = !!state.isConnected && !!state.isInternetReachable;
          setIsOnline(connected);
          setNetworkType(state.type || 'unknown');
          
          console.log('Network state changed:', {
            isConnected: state.isConnected,
            isInternetReachable: state.isInternetReachable,
            type: state.type,
            details: state.details
          });
        });
      } catch (err) {
        console.error('Failed to initialize network state:', err);
        setIsOnline(false);
      }
    };

    initializeNetworkState();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const loadLocalNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const localNotes = await LocalStorageService.getNotes();
      setNotes(localNotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load local notes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const syncWithServer = useCallback(async () => {
    if (!isOnline) {
      console.log('Skipping sync - device is offline');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Starting sync with server...');
      
      const syncQueue = await LocalStorageService.getSyncQueue();
      console.log(`Processing ${syncQueue.length} items in sync queue`);
      
      for (const item of syncQueue) {
        await syncNoteWithServer(item.operation, item.note);
      }
      
      await LocalStorageService.clearSyncQueue();
      
      const serverNotes = await ApiService.getNotes();
      const localNotes = await LocalStorageService.getAllNotes();
      const mergedNotes = mergeNotes(localNotes, serverNotes);
      
      await AsyncStorage.setItem(
        LocalStorageService.NOTES_KEY, 
        JSON.stringify(mergedNotes)
      );
      
      setNotes(mergedNotes.filter(note => !note.isDeleted));
      console.log('Sync completed successfully');
      
    } catch (err) {
      console.error('Sync failed:', err);
      setError('Sync failed. Will retry when connection is stable.');
    } finally {
      setIsLoading(false);
    }
  }, [isOnline]);

  useEffect(() => {
    if (isOnline) {
      console.log('Device came online, starting auto-sync...');
      syncWithServer();
    }
  }, [isOnline, syncWithServer]);

  const syncNoteWithServer = async (operation: 'create' | 'update' | 'delete', note: Note) => {
    try {
      switch (operation) {
        case 'create':
          const createdNote = await ApiService.createNote({
            title: note.title,
            description: note.description,
            image: note.image
          });
          const updatedNote = { ...note, id: createdNote.id, isSync: true };
          await LocalStorageService.saveNote(updatedNote);
          break;
          
        case 'update':
          if (note.id) {
            await ApiService.updateNote({
              id: note.id,
              title: note.title,
              description: note.description,
              image: note.image
            });
            const syncedNote = { ...note, isSync: true };
            await LocalStorageService.saveNote(syncedNote);
          }
          break;
          
        case 'delete':
          if (note.id) {
            await ApiService.deleteNote(note.id);
          }
          break;
      }
    } catch (err) {
      console.error(`Failed to sync ${operation} operation:`, err);
      await LocalStorageService.addToSyncQueue(operation, note);
      throw err;
    }
  };

  const mergeNotes = (localNotes: Note[], serverNotes: Note[]): Note[] => {
    const merged: Note[] = [...localNotes];
    
    serverNotes.forEach(serverNote => {
      const localIndex = merged.findIndex(n => n.id === serverNote.id);
      if (localIndex >= 0) {
        merged[localIndex] = { ...merged[localIndex], ...serverNote, isSync: true };
      } else {
        merged.push({ ...serverNote, localId: generateUUID(), isSync: true });
      }
    });
    
    return merged;
  };

  const createNote = useCallback(async (noteData: Omit<CreateNoteRequest, 'id'>) => {
    try {
      setError(null);
      const localId = generateUUID();
      const newNote: Note = {
        id: '',
        localId,
        title: noteData.title,
        description: noteData.description,
        image: noteData.image as string,
        createdAt: new Date(),
        updatedAt: new Date(),
        isSync: false,
        isDeleted: false
      };

      await LocalStorageService.saveNote(newNote);
      setNotes(prev => [...prev, newNote]);


      if (!isOnline) {
        await LocalStorageService.addToSyncQueue('create', newNote);
        console.log('Note created offline, added to sync queue');
      } else {
        console.log('Note created online, syncing immediately...');
        await syncNoteWithServer('create', newNote);
        await loadLocalNotes();  
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
    }
  }, [isOnline, loadLocalNotes]);


  const updateNote = useCallback(async (localId: string, noteData: Partial<CreateNoteRequest>) => {
    try {
      setError(null);
      const existingNote = notes.find(n => n.localId === localId);
      if (!existingNote) throw new Error('Note not found');

      const updatedNote: Note = {
        ...existingNote,
        ...noteData,
        image: noteData.image !== undefined
          ? (typeof noteData.image === 'string' ? noteData.image : existingNote.image)
          : existingNote.image,
        updatedAt: new Date(),
        isSync: false
      };

      await LocalStorageService.saveNote(updatedNote);
      setNotes(prev => prev.map(note => 
        note.localId === localId ? updatedNote : note
      ));

      if (!isOnline) {
        await LocalStorageService.addToSyncQueue('update', updatedNote);
        console.log('Note updated offline, added to sync queue');
      } else {
        console.log('Note updated online, syncing immediately...');
        await syncNoteWithServer('update', updatedNote);
        await loadLocalNotes();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update note');
    }
  }, [notes, isOnline, loadLocalNotes]);

  const deleteNote = useCallback(async (localId: string) => {
    try {
      setError(null);
      const note = notes.find(n => n.localId === localId);
      if (!note) throw new Error('Note not found');

      await LocalStorageService.deleteNote(localId);
      setNotes(prev => prev.filter(n => n.localId !== localId));

      if (!isOnline) {
        await LocalStorageService.addToSyncQueue('delete', note);
        console.log('Note deleted offline, added to sync queue');
      } else if (note.id) {
        console.log('Note deleted online, syncing immediately...');
        await ApiService.deleteNote(note.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
    }
  }, [notes, isOnline]);


  const manualSync = useCallback(async () => {
    if (!isOnline) {
      setError('Cannot sync while offline');
      return;
    }
    await syncWithServer();
  }, [isOnline, syncWithServer]);


  const refreshNetworkState = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();
      setIsOnline(!!state.isConnected && !!state.isInternetReachable);
      setNetworkType(state.type || 'unknown');
    } catch (err) {
      console.error('Failed to refresh network state:', err);
    }
  }, []);

  useEffect(() => {
    loadLocalNotes();
  }, [loadLocalNotes]);

  return { 
    notes,
    isOnline,
    isLoading,
    error,
    networkType, 
    createNote,
    updateNote,
    deleteNote,
    refreshNotes: loadLocalNotes,
    manualSync,
    refreshNetworkState,
    clearError: () => setError(null)
  };
};
