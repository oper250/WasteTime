/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import Toast from 'react-native-toast-message';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StoreProvider } from './src/StoreProvider';

const Root = () => (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
            <App />
        </BottomSheetModalProvider>
        <Toast visibilityTime={3000} />
    </GestureHandlerRootView>
);

AppRegistry.registerComponent(appName, () => Root);
