import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NotesListScreen } from './src/screens/Notes/NotesList';
import NetworkDebugger from './src/services/NetworkLogger';


const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <NotesListScreen/>
      <NetworkDebugger />
    </SafeAreaProvider>
  );
};

export default App;
