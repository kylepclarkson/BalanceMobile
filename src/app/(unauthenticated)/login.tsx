import { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/design-system/Button';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      // No manual navigation needed — Stack.Protected reacts to isAuthenticated change
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 justify-center p-6">
      <Text className="mb-6 text-center text-2xl font-bold">Sign In</Text>
      {error && <Text className="mb-3 text-center text-red-500">{error}</Text>}
      <TextInput
        className="mb-3 w-full rounded-lg border border-gray-300 p-3"
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="mb-3 w-full rounded-lg border border-gray-300 p-3"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Log In" onPress={handleLogin} loading={loading} className="mb-2" />
      <Button title="Create account" variant="ghost" onPress={() => router.push('/register')} />
    </View>
  );
}
