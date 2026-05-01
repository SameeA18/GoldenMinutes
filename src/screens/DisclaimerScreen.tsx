import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors, spacing } from '../constants/theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Disclaimer'>;

const bullets = [
  'This application is a dissertation prototype for academic purposes only.',
  'It is not connected to real emergency services and must not be used in real emergencies.',
  'All incidents and locations are simulated — there are no real patients or participant data.',
];

export function DisclaimerScreen({ navigation }: Props) {
  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>Safety & disclaimer</Text>
      {bullets.map((line) => (
        <View key={line} style={styles.row}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.line}>{line}</Text>
        </View>
      ))}
      <PrimaryButton title="I understand" onPress={() => navigation.goBack()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  bullet: {
    fontSize: 18,
    color: colors.accent,
    marginRight: spacing.sm,
    lineHeight: 24,
  },
  line: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
});
