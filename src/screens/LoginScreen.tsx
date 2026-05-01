import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors, spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { loginDemo } = useApp();

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>Demo sign-in</Text>
      <Text style={styles.sub}>
        No real accounts are used. Continue as a demo volunteer to explore the
        prototype with simulated incidents only.
      </Text>
      <PrimaryButton
        title="Continue as demo volunteer"
        onPress={async () => {
          await loginDemo();
          navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        }}
        style={styles.btn}
      />
      <PrimaryButton
        title="Back"
        variant="outline"
        onPress={() => navigation.goBack()}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  sub: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  btn: {
    marginBottom: spacing.sm,
  },
});
