import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import NotificationList from './src/components/NotificationList';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <NotificationList />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
