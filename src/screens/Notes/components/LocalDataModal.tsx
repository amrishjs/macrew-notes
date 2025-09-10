import React from 'react';
import { Modal, StyleSheet } from 'react-native';
import { LocalDataTable } from './LocalDataTable';
import { Note } from '../../../types/notes';

interface LocalDataModalProps {
  visible: boolean;
  notes: Note[];
  onClose: () => void;
}

export const LocalDataModal: React.FC<LocalDataModalProps> = React.memo(({
  visible,
  notes,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <LocalDataTable
        notes={notes}
        onClose={onClose}
      />
    </Modal>
  );
});

LocalDataModal.displayName = 'LocalDataModal';
