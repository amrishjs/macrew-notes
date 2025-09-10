import React, { memo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Note } from '../../../types/notes';

interface NoteItemProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (localId: string) => void;
}

export const NoteItem: React.FC<NoteItemProps> = memo(
  ({ note, onEdit, onDelete }) => {
    const handleDelete = () => {
      Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(note.localId!),
        },
      ]);
    };

    const getSyncStatusColor = () => {
      if (note.isSync) return '#4CAF50';
      return '#FF9800';
    };

    const getSyncStatusText = () => {
      if (note.isSync) return '✓ Synced';
      return '⏳ Pending Sync';
    };

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {note.image && (
            <Image source={{ uri: note.image }} style={styles.image} />
          )}
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {note.title}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {note.description}
            </Text>
            <View style={styles.statusContainer}>
              <Text style={[styles.status, { color: getSyncStatusColor() }]}>
                {getSyncStatusText()}
              </Text>
              <Text style={styles.timestamp}>
                {note.updatedAt
                  ? new Date(note.updatedAt).toLocaleDateString()
                  : ''}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEdit(note)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
