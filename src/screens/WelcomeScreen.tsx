import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors, spacing } from '../constants/theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <ScreenContainer scroll>
      <View style={styles.hero}>
        <Text style={styles.brand}>GoldenMinutes</Text>
        <Text style={styles.tagline}>Every minute matters.</Text>
      </View>
      <Text style={styles.body}>
        This prototype demonstrates how trained community volunteers could be
        alerted to nearby medical emergencies in research simulations — before
        an ambulance arrives. It uses simulated data only and does not connect to real
        emergency services.
      </Text>
      <Text style={styles.project}>
        Part of: “Reducing Response Times: Evaluating Community First Responder
        Integration Within Emergency Medical Systems.”
      </Text>
      <PrimaryButton
        title="Continue"
        onPress={() => navigation.navigate('Login')}
        style={styles.cta}
      />
      <PrimaryButton
        title="Read safety disclaimer"
        variant="outline"
        onPress={() => navigation.navigate('Disclaimer')}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 3,
    borderBottomColor: colors.accent,
  },
  brand: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  tagline: {
    marginTop: spacing.sm,
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    marginBottom: spacing.md,
  },
  project: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    fontStyle: 'italic',
  },
  cta: {
    marginBottom: spacing.sm,
  },
});
