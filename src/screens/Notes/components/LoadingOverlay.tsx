import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface LoadingOverlayProps {
  isLoading: boolean;
  isOnline: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = React.memo(({
  isLoading,
  isOnline,
}) => {
  if (!isLoading) return null;

  return (
    <View style={styles.loadingOverlay}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>
          {isOnline ? 'Syncing notes...' : 'Loading notes...'}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#374151',
  },
});

LoadingOverlay.displayName = 'LoadingOverlay';
