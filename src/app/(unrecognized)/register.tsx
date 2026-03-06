import { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/design-system/Button';

export default function RegisterScreen() {
  const { signup } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // TODO add additional validation.
      if (!email || !password) {
        setError('Email and password are required');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      await signup({ email, password: password });
      // No manual navigation needed — Stack.Protected reacts to isAuthenticated change
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 justify-center p-6">
      <Text className="mb-6 text-center text-2xl font-bold">Create Account</Text>
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
      <TextInput
        className="mb-3 w-full rounded-lg border border-gray-300 p-3"
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button title="Create Account" onPress={handleRegister} loading={loading} className="mb-2" />
      <Button title="Already have an account? Sign in" variant="ghost" onPress={() => router.back()} />
    </View>
  );
}
