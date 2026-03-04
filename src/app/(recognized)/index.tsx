import { View, Text, Button, StyleSheet } from 'react-native';

import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>You're logged in!</Text>
      <Button title="Log out" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heading: { fontSize: 20, marginBottom: 16 },
});
