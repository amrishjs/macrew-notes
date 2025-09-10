import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ActionButtonsProps {
  isOnline: boolean;
  onAddNote: () => void;
  onShowLocalData: () => void;
  onSync: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = React.memo(({
  isOnline,
  onAddNote,
  onShowLocalData,
  onSync,
}) => {
  return (
    <View style={styles.actionButtons}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={onAddNote}
      >
        <Text style={styles.addButtonText}>+ Add Note</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.localDataButton}
        onPress={onShowLocalData}
      >
        <Text style={styles.localDataButtonText}>Local Data</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.syncButton, { opacity: isOnline ? 1 : 0.5 }]}
        onPress={onSync}
        disabled={!isOnline}
      >
        <Text style={styles.syncButtonText}>Sync</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  localDataButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  localDataButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  syncButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  syncButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

ActionButtons.displayName = 'ActionButtons';
