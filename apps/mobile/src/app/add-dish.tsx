import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../api';

export default function AddDishScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [placeName, setPlaceName] = useState('');
  const [saving, setSaving] = useState(false);

  const saveDish = async () => {
    if (!name.trim()) {
      Alert.alert('Missing dish name', 'Please enter a dish name.');
      return;
    }

    try {
      setSaving(true);
      await api.post('/dishes', {
        name: name.trim(),
        place_name: placeName.trim() || null,
      });
      router.back();
    } catch (error: any) {
      Alert.alert(
        'Could not save dish',
        error?.response?.data?.message || error?.message || 'Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Add a dish you love</Text>
        <Text style={styles.subtitle}>
          Save the dish and where you had it.
        </Text>

        <Text style={styles.label}>Dish name *</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Chicken 65"
          placeholderTextColor="#A69A8D"
          style={styles.input}
          autoCapitalize="words"
          returnKeyType="next"
        />

        <Text style={styles.label}>Restaurant or place</Text>
        <TextInput
          value={placeName}
          onChangeText={setPlaceName}
          placeholder="e.g. Anna Stall"
          placeholderTextColor="#A69A8D"
          style={styles.input}
          autoCapitalize="words"
          returnKeyType="done"
        />

        <Pressable
          style={[styles.saveButton, saving && styles.disabledButton]}
          onPress={saveDish}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save dish</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F1',
  },
  content: {
    padding: 24,
    gap: 12,
  },
  heading: {
    color: '#2B2118',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 8,
  },
  subtitle: {
    color: '#786D63',
    fontSize: 15,
    marginBottom: 20,
  },
  label: {
    color: '#3F3329',
    fontWeight: '700',
    marginTop: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8DCCF',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#2B2118',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#C2410C',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.65,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
