import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors, spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import type { RootStackParamList } from '../navigation/types';
import type { TrainingLevel } from '../types/models';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const LEVELS: TrainingLevel[] = ['First Aider', 'Nurse', 'Doctor', 'Paramedic'];

export function ProfileScreen({ navigation }: Props) {
  const { volunteer, updateVolunteer } = useApp();
  const [name, setName] = useState(volunteer.name);

  useFocusEffect(
    useCallback(() => {
      setName(volunteer.name);
    }, [volunteer.name])
  );

  const save = () => {
    updateVolunteer({ name: name.trim() || volunteer.name });
    navigation.goBack();
  };

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>Volunteer profile</Text>
      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        placeholderTextColor={colors.textSecondary}
        style={styles.input}
        accessibilityLabel="Volunteer name"
      />

      <Text style={styles.label}>Training level</Text>
      <View style={styles.levelGrid}>
        {LEVELS.map((level) => {
          const selected = volunteer.trainingLevel === level;
          return (
            <PrimaryButton
              key={level}
              title={level}
              variant={selected ? 'primary' : 'outline'}
              onPress={() =>
                updateVolunteer({ trainingLevel: level, role: level })
              }
              style={styles.levelBtn}
            />
          );
        })}
      </View>

      <Text style={styles.label}>Availability</Text>
      <Text style={styles.availHint}>
        Toggle on the home dashboard for quick changes. Current:{' '}
        <Text style={styles.bold}>
          {volunteer.isAvailable ? 'Available' : 'Unavailable'}
        </Text>
      </Text>

      <PrimaryButton title="Save" onPress={save} style={styles.save} />
      <PrimaryButton
        title="Cancel"
        variant="outline"
        onPress={() => navigation.goBack()}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 17,
    color: colors.text,
    marginBottom: spacing.lg,
    minHeight: 48,
  },
  levelGrid: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  levelBtn: {
    marginBottom: 0,
  },
  availHint: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  bold: {
    fontWeight: '700',
    color: colors.text,
  },
  save: {
    marginBottom: spacing.sm,
  },
});
