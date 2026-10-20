import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { describeApiError, isUnauthorized } from '@/api/errors';
import { fetchBalances } from '@/api/endpoints';
import { useTokenContext } from '@/auth/TokenProvider';
import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { colors, fontSize, fontWeight, layout, radius, spacing } from '@/theme/tokens';

export const TokenForm = () => {
  const { setToken, signOutReason } = useTokenContext();
  const [input, setInput] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    const candidate = input.trim();
    if (!candidate) {
      setError('Paste your API token to continue.');
      return;
    }
    setIsChecking(true);
    setError(null);
    try {
      await fetchBalances(candidate);
      setToken(candidate);
    } catch (caught) {
      setError(isUnauthorized(caught) ? "That token didn't work. Check it and try again." : describeApiError(caught));
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>CashMine</Text>
        <Text style={styles.subtitle}>Enter your API token to see your payback.</Text>
      </View>
      {signOutReason ? <Text style={styles.notice}>{signOutReason}</Text> : null}
      <View style={styles.field}>
        <Text style={styles.label}>API token</Text>
        <TextInput
          value={input}
          onChangeText={setInput}
          onSubmitEditing={submit}
          placeholder="Paste token"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          style={[styles.input, error && styles.inputError]}
          accessibilityLabel="API token"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Text style={styles.hint}>Stored only in this browser. You can change it any time.</Text>
      </View>
      <AppButton label="Continue" onPress={submit} loading={isChecking} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
  notice: {
    fontSize: fontSize.sm,
    color: colors.warning,
    backgroundColor: colors.warningSoft,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  input: {
    minHeight: layout.minTouchTarget + spacing.xs,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    fontSize: fontSize.md,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    fontSize: fontSize.sm,
    color: colors.danger,
  },
  hint: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
});
