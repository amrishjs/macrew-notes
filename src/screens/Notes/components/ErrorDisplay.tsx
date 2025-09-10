import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ErrorDisplayProps {
  error: string | null;
  onClearError: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = React.memo(({
  error,
  onClearError,
}) => {
  if (!error) return null;

  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>⚠️ {error}</Text>
      <TouchableOpacity onPress={onClearError} style={styles.errorCloseButton}>
        <Text style={styles.errorCloseText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  errorContainer: {
    backgroundColor: '#FEE2E2',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    flex: 1,
  },
  errorCloseButton: {
    padding: 4,
  },
  errorCloseText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

ErrorDisplay.displayName = 'ErrorDisplay';
