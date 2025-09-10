// Extend jest matchers for React Native Testing Library if installed
// import '@testing-library/jest-native/extend-expect';

jest.mock('@react-native-async-storage/async-storage', () => {
  let store: Record<string, string | null> = {};
  return {
    setItem: jest.fn(async (key: string, value: string) => {
      store[key] = value;
    }),
    getItem: jest.fn(async (key: string) => store[key] ?? null),
    removeItem: jest.fn(async (key: string) => {
      delete store[key];
    }),
    clear: jest.fn(async () => {
      store = {};
    }),
    getAllKeys: jest.fn(async () => Object.keys(store)),
  };
});

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn((_options, callback) => {
    const response = { assets: [{ uri: 'test://image.jpg' }] };
    if (callback) callback(response);
    return Promise.resolve(response);
  }),
}));


jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() =>
    Promise.resolve({ isConnected: false, isInternetReachable: false, type: 'none' })
  ),
  addEventListener: jest.fn(() => jest.fn()),
}));

jest.mock('react-native-network-logger', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: () => React.createElement('View', { testID: 'network-logger' }),
  };
});


