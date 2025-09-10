import { LegendList } from '@legendapp/list';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Note } from '../types/notes';

interface LocalDataTableProps {
  notes: Note[];
  onClose: () => void;
}

export const LocalDataTable: React.FC<LocalDataTableProps> = memo(
  ({ notes, onClose }) => {
    const renderTableRow = ({ item }: { item: Note }) => (
      <View style={styles.tableRow}>
        <Text style={styles.tableCell} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.tableCell} numberOfLines={1}>
          {item.description.substring(0, 30)}...
        </Text>
        <Text style={[styles.tableCell, styles.statusCell]}>
          {item.isSync ? '✅' : '❌'}
        </Text>
        <Text style={styles.tableCell}>{item.isDeleted ? '🗑️' : '📝'}</Text>
      </View>
    );

    const renderHeader = () => (
      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text style={styles.tableCellHeader}>Title</Text>
        <Text style={styles.tableCellHeader}>Description</Text>
        <Text style={styles.tableCellHeader}>Synced</Text>
        <Text style={styles.tableCellHeader}>Status</Text>
      </View>
    );

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Local Data Table</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{notes.length}</Text>
            <Text style={styles.statLabel}>Total Notes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {notes.filter(n => n.isSync).length}
            </Text>
            <Text style={styles.statLabel}>Synced</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {notes.filter(n => !n.isSync).length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        <LegendList
          recycleItems
          data={notes}
          keyExtractor={item => item.localId || item.id}
          renderItem={renderTableRow}
          ListHeaderComponent={renderHeader}
          style={styles.table}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No notes in local storage</Text>
            </View>
          )}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#3B82F6',
    borderRadius: 6,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  table: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableHeader: {
    backgroundColor: '#F9FAFB',
    borderBottomColor: '#E5E7EB',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusCell: {
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
});
