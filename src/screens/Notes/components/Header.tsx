import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NetworkStatus } from './NetworkStatus';

interface HeaderProps {
  isOnline: boolean;
  networkType: string;
  onRefreshNetwork: () => void;
}

export const Header: React.FC<HeaderProps> = React.memo(({
  isOnline,
  networkType,
  onRefreshNetwork,
}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Macrew Assignment</Text>
      <NetworkStatus
        isOnline={isOnline}
        networkType={networkType}
        onRefresh={onRefreshNetwork}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingTop: 50,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
});

Header.displayName = 'Header';
