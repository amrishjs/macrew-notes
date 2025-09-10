import React, { useMemo } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Note } from '../../../types/notes';

interface AddEditModalProps {
  visible: boolean;
  editingNote: Note | null;
  title: string;
  description: string;
  imageUri: string | undefined;
  onTitleChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
  onImagePick: () => void;
  onSave: () => void;
  onClose: () => void;
}

export const AddEditModal: React.FC<AddEditModalProps> = React.memo(({
  visible,
  editingNote,
  title,
  description,
  imageUri,
  onTitleChange,
  onDescriptionChange,
  onImagePick,
  onSave,
  onClose,
}) => {
  // Memoized values for better performance
  const modalTitle = useMemo(() => 
    editingNote ? 'Edit Note' : 'Add New Note',
    [editingNote]
  );

  const saveButtonText = useMemo(() => 
    editingNote ? 'Update Note' : 'Save Note',
    [editingNote]
  );

  const imageButtonText = useMemo(() => 
    imageUri ? '📷 Change Image' : '📷 Add Image',
    [imageUri]
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
    >
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {modalTitle}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Note title"
            value={title}
            onChangeText={onTitleChange}
            maxLength={100}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Note description"
            value={description}
            onChangeText={onDescriptionChange}
            multiline
            numberOfLines={4}
            maxLength={500}
          />

          <TouchableOpacity
            style={styles.imageButton}
            onPress={onImagePick}
          >
            <Text style={styles.imageButtonText}>
              {imageButtonText}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={onSave}>
            <Text style={styles.saveButtonText}>
              {saveButtonText}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  imageButton: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  imageButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

AddEditModal.displayName = 'AddEditModal';
