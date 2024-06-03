// Storage.js

import { MMKV } from 'react-native-mmkv'
// import { Platform, NativeModules } from 'react-native';

// let USER_DIRECTORY;

// if (Platform.OS === 'android') {
//   // Get the app's private files directory on Android
//   const filesDir = NativeModules?.ReactNativeMmkv?.getFilesDir();
//   USER_DIRECTORY = filesDir;
// } else if (Platform.OS === 'ios') {
//   // Get the app's Documents directory on iOS
//   const { NSSearchPathForDirectoriesInDomains } = NativeModules;
//   const documentsDir = NSSearchPathForDirectoriesInDomains('DocumentDirectory', true, true)[0];
//   USER_DIRECTORY = documentsDir;
// } else {
//   // Fallback to a default directory for other platforms
//   USER_DIRECTORY = '/path/to/fallback/directory';
// }

// export const storage = new MMKV({
//   id: `user-storage`,
//   path: `${USER_DIRECTORY}/storage`,
//   encryptionKey: 'encryptionkey'
// })

export const storage = new MMKV()