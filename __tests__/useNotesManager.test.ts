import { renderHook, act, waitFor } from '@testing-library/react-native';
import { LocalStorageService } from '../src/services/storage';
import { useNotesManager } from '../src/hooks/useNotesManager';

jest.mock('../src/services/storage');
jest.mock('../src/services/axios');
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() =>
    Promise.resolve({
      isConnected: false,
      isInternetReachable: false,
      type: 'none',
    }),
  ),
  addEventListener: jest.fn(() => jest.fn()),
}));

describe('useNotesManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (LocalStorageService.getNotes as jest.Mock).mockResolvedValue([]);
    (LocalStorageService.saveNote as jest.Mock).mockResolvedValue(undefined);
    (LocalStorageService.addToSyncQueue as jest.Mock).mockResolvedValue(
      undefined,
    );
  });

  it('should initialize with empty notes', async () => {
    const { result } = renderHook(() => useNotesManager());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.notes).toEqual([]);
    expect(result.current.isOnline).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should create a note successfully', async () => {
    const { result } = renderHook(() => useNotesManager());

    const noteData = {
      title: 'Test Note',
      description: 'Test Description',
      image: 'test-image.jpg',
    };

    await act(async () => {
      await result.current.createNote(noteData);
    });

    expect(LocalStorageService.saveNote).toHaveBeenCalledWith(
      expect.objectContaining({
        title: noteData.title,
        description: noteData.description,
        image: noteData.image,
        isSync: false,
        isDeleted: false,
      }),
    );

    expect(result.current.notes).toHaveLength(1);
    expect(result.current.notes[0].title).toBe(noteData.title);
  });

  it('should handle errors when creating a note', async () => {
    const { result } = renderHook(() => useNotesManager());

    const error = new Error('Storage failed');
    (LocalStorageService.saveNote as jest.Mock).mockRejectedValue(error);

    const noteData = {
      title: 'Test Note',
      description: 'Test Description',
    };

    await act(async () => {
      await result.current.createNote(noteData);
    });

    expect(result.current.error).toBe('Storage failed');
  });
});
