import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const EmptyListComponent: React.FC = React.memo(() => {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📝</Text>
      <Text style={styles.emptyText}>No notes yet</Text>
      <Text style={styles.emptySubtext}>
        Tap "Add Note" to create your first note!
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});

EmptyListComponent.displayName = 'EmptyListComponent';
