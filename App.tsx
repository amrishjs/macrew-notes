import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NotesListScreen } from './src/screens/Notes/NotesList';
import NetworkDebugger from './src/services/NetworkLogger';
import Config from './src/config/env';

const BASE_URL = Config.API_BASE_URL;

const App: React.FC = () => {
  console.log('API Base URL:', BASE_URL);
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <NotesListScreen/>
      <NetworkDebugger />
    </SafeAreaProvider>
  );
};

export default App;
