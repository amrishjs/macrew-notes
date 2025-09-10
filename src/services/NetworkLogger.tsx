import { Modal, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import NetworkLogger from 'react-native-network-logger';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NetworkDebugger = () => {
  const [showModal, setModalVisibility] = React.useState(false);
  const insets = useSafeAreaInsets();
  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisibility(true)}
        style={{
          position: 'absolute',
          bottom: 24,
          left: 0,
          borderWidth: 1,
          borderRadius: 40 / 2,
          borderColor: 'white',
          margin: 12,
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 40 / 2,
            padding: 12,
            backgroundColor: 'black',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 14, color: 'white', fontWeight: '500' }}>
            D
          </Text>
        </View>
      </TouchableOpacity>
      <Modal animationType="slide" visible={showModal}>
        {/* <SafeAreaView /> */}
        <View style={{ paddingTop: insets.top, flex: 1 }}>
          <TouchableOpacity
            onPress={() => setModalVisibility(false)}
            style={{
              flexDirection: 'row',
              backgroundColor: 'black',
              justifyContent: 'center',
              padding: 12,
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>Close</Text>
          </TouchableOpacity>
          <NetworkLogger />
        </View>
      </Modal>
    </View>
  );
};

export default NetworkDebugger;
