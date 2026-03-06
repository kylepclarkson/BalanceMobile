import { ActivityIndicator, Pressable, Text } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Button({ title, onPress, variant = 'primary', loading = false, disabled = false, className }: ButtonProps) {
  const isDisabled = disabled || loading;

  if (variant === 'ghost') {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        className={`w-full items-center px-4 py-3 active:opacity-60 disabled:opacity-40 ${className ?? ''}`}
      >
        <Text className="text-base text-blue-600">{title}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`w-full items-center rounded-lg bg-blue-600 px-4 py-3 active:bg-blue-700 disabled:opacity-50 ${className ?? ''}`}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-base font-semibold text-white">{title}</Text>
      )}
    </Pressable>
  );
}
