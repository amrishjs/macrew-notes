import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NetworkStatusProps {
  isOnline: boolean;
  networkType: string;
  onRefresh: () => void;
}

export const NetworkStatus: React.FC<NetworkStatusProps> = React.memo(({
  isOnline,
  networkType,
  onRefresh,
}) => {
  const getNetworkIcon = () => {
    if (!isOnline) return '🔴';

    switch (networkType) {
      case 'wifi':
        return '📶';
      case 'cellular':
        return '📱';
      case 'ethernet':
        return '🌐';
      default:
        return '🟢';
    }
  };

  const getNetworkText = () => {
    if (!isOnline) return 'Offline';

    const typeText = networkType.charAt(0).toUpperCase() + networkType.slice(1);
    return `Online (${typeText})`;
  };

  return (
    <View style={styles.networkInfo}>
      <TouchableOpacity
        onPress={onRefresh}
        style={styles.networkStatus}
      >
        <Text style={styles.networkIcon}>{getNetworkIcon()}</Text>
        <Text
          style={[
            styles.networkText,
            { color: isOnline ? '#10B981' : '#EF4444' },
          ]}
        >
          {getNetworkText()}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  networkInfo: {
    alignItems: 'center',
  },
  networkStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  networkIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  networkText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

NetworkStatus.displayName = 'NetworkStatus';
