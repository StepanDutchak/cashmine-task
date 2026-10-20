import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { describeApiError, isUnauthorized } from '@/api/errors';
import { fetchBalances } from '@/api/endpoints';
import { useTokenContext } from '@/auth/TokenProvider';
import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { colors, fontSize, fonts, layout, radius, spacing } from '@/theme/tokens';

export const TokenForm = () => {
  const { setToken, signOutReason } = useTokenContext();
  const [input, setInput] = useState('');
  const [isVisible, setIsVisible] = useState(false);
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
    <Screen footer={<AppButton label="Continue" onPress={submit} loading={isChecking} />}>
      <View style={styles.header}>
        <View style={styles.mark}>
          <Ionicons name="return-down-back" size={26} color={colors.heroAccent} />
        </View>
        <Text style={styles.title}>Your trading fees, paid back</Text>
        <Text style={styles.subtitle}>Enter the API token from your CashMine email to see and claim your payback.</Text>
      </View>
      {signOutReason ? (
        <View style={styles.notice}>
          <Ionicons name="alert-circle-outline" size={18} color={colors.warning} />
          <Text style={styles.noticeText}>{signOutReason}</Text>
        </View>
      ) : null}
      <View style={styles.field}>
        <Text style={styles.label}>API token</Text>
        <View style={[styles.inputRow, error && styles.inputRowError]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            onSubmitEditing={submit}
            placeholder="Paste token"
            placeholderTextColor={colors.textFaint}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={!isVisible}
            style={styles.input}
            accessibilityLabel="API token"
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isVisible ? 'Hide token' : 'Show token'}
            onPress={() => setIsVisible((visible) => !visible)}
            style={({ pressed }) => [styles.toggle, pressed && styles.pressed]}
          >
            <Ionicons name={isVisible ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
          </Pressable>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Text style={styles.hint}>Stored only in this browser. You can change it any time.</Text>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  mark: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.hero,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: fontSize.xxl,
    lineHeight: 38,
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.md,
    lineHeight: 22,
    color: colors.textMuted,
  },
  notice: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.warningSoft,
  },
  noticeText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.warning,
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    fontFamily: fonts.displayMedium,
    fontSize: fontSize.sm,
    color: colors.text,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    paddingLeft: spacing.lg,
  },
  inputRowError: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: layout.minTouchTarget + spacing.md,
    fontFamily: fonts.mono,
    fontSize: fontSize.md,
    color: colors.text,
  },
  toggle: {
    width: layout.minTouchTarget + spacing.sm,
    height: layout.minTouchTarget + spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
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
