import { LegendList } from '@legendapp/list';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import { useNotesManager } from '../../hooks/useNotesManager';
import { Note } from '../../types/notes';
import { ActionButtons } from './components/ActionButtons';
import { AddEditModal } from './components/AddEditModal';
import { EmptyListComponent } from './components/EmptyListComponent';
import { ErrorDisplay } from './components/ErrorDisplay';
import { Header } from './components/Header';
import { LoadingOverlay } from './components/LoadingOverlay';
import { LocalDataModal } from './components/LocalDataModal';
import { NoteItem } from './components/NoteItem';

export const NotesListScreen: React.FC = () => {
  const {
    notes,
    isOnline,
    isLoading,
    error,
    networkType,
    createNote,
    updateNote,
    deleteNote,
    manualSync,
    refreshNetworkState,
    clearError,
  } = useNotesManager();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [showLocalDataTable, setShowLocalDataTable] = useState(false);

  const resetModal = useCallback(() => {
    setIsModalVisible(false);
    setEditingNote(null);
    setTitle('');
    setDescription('');
    setImageUri(undefined);
  }, []);

  const handleSaveNote = useCallback(async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in both title and description');
      return;
    }

    try {
      const noteData = {
        title: title.trim(),
        description: description.trim(),
        image: imageUri,
      };

      if (editingNote) {
        await updateNote(editingNote.localId!, noteData);
      } else {
        await createNote(noteData);
      }

      resetModal();
    } catch (err) {
      Alert.alert('Error', 'Failed to save note');
    }
  }, [title, description, imageUri, editingNote, createNote, updateNote, resetModal]);

  const handleEditNote = useCallback((note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setDescription(note.description);
    setImageUri(note.image);
    setIsModalVisible(true);
  }, []);

  const handlePickImage = useCallback(() => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.7,
      },
      (response: ImagePickerResponse) => {
        if (response.assets && response.assets[0]) {
          setImageUri(response.assets[0].uri);
        }
      },
    );
  }, []);

  const renderNoteItem = useCallback(
    ({ item }: { item: Note }) => (
      <NoteItem note={item} onEdit={handleEditNote} onDelete={deleteNote} />
    ),
    [handleEditNote, deleteNote],
  );

  const keyExtractor = useCallback((item: Note) => item.localId || item.id, []);
  
  const contentContainerStyle = useMemo(() => 
    notes.length === 0 ? styles.emptyListContent : styles.listContent,
    [notes.length]
  );

  const offlineBannerVisible = !isOnline;

  const handleAddNote = useCallback(() => setIsModalVisible(true), []);
  const handleShowLocalData = useCallback(() => setShowLocalDataTable(true), []);
  const handleCloseLocalData = useCallback(() => setShowLocalDataTable(false), []);

  return (
    <View style={styles.container}>
      <Header
        isOnline={isOnline}
        networkType={networkType}
        onRefreshNetwork={refreshNetworkState}
      />
      <ActionButtons
        isOnline={isOnline}
        onAddNote={handleAddNote}
        onShowLocalData={handleShowLocalData}
        onSync={manualSync}
      />
      <ErrorDisplay error={error} onClearError={clearError} />
      {offlineBannerVisible && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineBannerText}>
            📡 You're offline. Changes will sync when connection is restored.
          </Text>
        </View>
      )}
      <LegendList
        data={notes}
        keyExtractor={keyExtractor}
        renderItem={renderNoteItem}
        recycleItems
        ListEmptyComponent={EmptyListComponent}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
      />

      <AddEditModal
        visible={isModalVisible}
        editingNote={editingNote}
        title={title}
        description={description}
        imageUri={imageUri}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onImagePick={handlePickImage}
        onSave={handleSaveNote}
        onClose={resetModal}
      />
      <LocalDataModal
        visible={showLocalDataTable}
        notes={notes}
        onClose={handleCloseLocalData}
      />
      <LoadingOverlay isLoading={isLoading} isOnline={isOnline} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  offlineBanner: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F59E0B',
  },
  offlineBannerText: {
    color: '#92400E',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyListContent: {
    flexGrow: 1,
  },
});
