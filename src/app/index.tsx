import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const KINOPULSE_URL = 'https://vparkb.github.io/jula-webapp/';

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const timeout = setTimeout(() => setIsLoading(false), 10000);
    return () => clearTimeout(timeout);
  }, [isLoading, reloadKey]);

  const reload = () => {
    setErrorMessage(null);
    setIsLoading(true);
    setReloadKey((currentKey) => currentKey + 1);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <WebView
        key={reloadKey}
        source={{ uri: KINOPULSE_URL }}
        style={styles.webView}
        javaScriptEnabled
        domStorageEnabled
        onLoadStart={() => {
          setErrorMessage(null);
          setIsLoading(true);
        }}
        onLoadProgress={({ nativeEvent }) => {
          if (nativeEvent.progress >= 0.9) {
            setIsLoading(false);
          }
        }}
        onLoadEnd={() => setIsLoading(false)}
        onError={({ nativeEvent }) => {
          setIsLoading(false);
          setErrorMessage(nativeEvent.description || 'Неизвестная ошибка WebView');
        }}
      />

      {isLoading && !errorMessage && (
        <View style={styles.centered} pointerEvents="none">
          <ActivityIndicator size="large" color="#18c7f4" />
          <Text style={styles.message}>Загружаем КиноПульс...</Text>
        </View>
      )}

      {errorMessage && (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>Не удалось открыть КиноПульс</Text>
          <Text style={styles.message}>{errorMessage}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={reload}
            style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}>
            <Text style={styles.retryButtonText}>Повторить</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06101a',
  },
  webView: {
    flex: 1,
    backgroundColor: '#06101a',
  },
  centered: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
    backgroundColor: '#06101a',
  },
  errorTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    color: '#a7b5c7',
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#18c7f4',
  },
  retryButtonPressed: {
    opacity: 0.75,
  },
  retryButtonText: {
    color: '#06101a',
    fontSize: 15,
    fontWeight: '700',
  },
});
