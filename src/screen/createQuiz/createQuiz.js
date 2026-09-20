import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc, onSnapshot, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FIREBASE_FIRESTORE as firestore } from '../../../firebaseConfig';
import AppButton from '../../components/AppButton';
import BackButton from '../../components/BackButton';
import DatePicker from '../../components/DateTimePickerModal';
import InputField from '../../components/InputField';
import Loader from '../../components/Loader';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { Colors } from '../../theme/theme';
import { styles } from './style';

const MIN_OPTIONS = 3;
const DURATION_MINUTES = [...Array(60)].map((_, i) => i + 1).concat([75, 90, 105, 120, 150, 180]);
const digitsOnly = (text) => text.replace(/[^0-9]/g, '');
const NEW_LEVEL = '1';
const EXISTING_LEVEL = '2';

function Radio({ label, active, onPress }) {
  return (
    <TouchableOpacity style={styles.radio} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.radioCircle, active && styles.radioCircleActive]}>
        {active && <View style={styles.radioDot} />}
      </View>
      <Text style={[styles.radioText, active && styles.radioTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function TimeField({ value, placeholder, onPress, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.timeField, disabled && styles.timeFieldDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
    >
      <Text style={[styles.timeText, !value && styles.timePlaceholder]} numberOfLines={1}>
        {value || placeholder}
      </Text>
      <Ionicons name="chevron-down" size={18} color={Colors.textSecondary} />
    </TouchableOpacity>
  );
}

const formatTime = (date) =>
  date && date.toLocaleString() !== 'Invalid Date' ? date.toLocaleString() : '';

export default function CreateQuiz({ route, navigation }) {
  const { categoryId } = route.params;
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [reason, setReason] = useState('');
  const [score, setScore] = useState('');
  const [levelMode, setLevelMode] = useState(NEW_LEVEL);
  const [level, setLevel] = useState('');
  const [duration, setDuration] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [picking, setPicking] = useState(null); // 'start' | 'end' | null
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [availableLevels, setAvailableLevels] = useState([]);
  const { toastMessage, showToast } = useToast();

  const isExisting = levelMode === EXISTING_LEVEL;

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(doc(firestore, 'categories', categoryId), 'quizzes'), (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setQuizData(data);
      setAvailableLevels(Array.from(new Set(data.map((item) => item.level))));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [categoryId]);

  // Existing level: inherit its duration and window. New level: start blank.
  useEffect(() => {
    if (!isExisting) {
      setDuration('');
      setStartTime(null);
      setEndTime(null);
      return;
    }

    const selected = quizData.find((item) => item.level === level);
    if (selected) {
      setDuration(selected.duration);
      setStartTime(new Date(selected.startTime));
      setEndTime(new Date(selected.endTime));
    }
  }, [isExisting, level, quizData]);

  const chooseLevelMode = (mode) => {
    setLevelMode(mode);
    setLevel(mode === EXISTING_LEVEL ? availableLevels[0] || '' : '');
  };

  const setOptionAt = (index, text) =>
    setOptions((prev) => prev.map((option, i) => (i === index ? text : option)));

  const removeOption = (index) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
    setCorrectIndex((prev) => (index < prev ? prev - 1 : index === prev ? 0 : prev));
  };

  // A level inherited from an older quiz may use a duration that isn't in the standard list.
  const durationChoices = duration && !DURATION_MINUTES.includes(Number(duration))
    ? [...DURATION_MINUTES, Number(duration)].sort((a, b) => a - b)
    : DURATION_MINUTES;

  const handleCreateQuiz = async () => {
    const filledOptions = options.map((option) => option.trim()).filter(Boolean);
    const correctOption = options[correctIndex].trim();

    if (!question.trim() || !level.trim() || !score.trim() || !String(duration).trim()) {
      return showToast('Please fill in related fields.');
    }
    if (filledOptions.length < 2 || !correctOption) {
      return showToast('Add at least two options and pick a filled one as correct.');
    }
    if (startTime && endTime && endTime <= startTime) {
      return showToast('End time must be greater than start time.');
    }
    if (!isExisting && quizData.some((quiz) => quiz.level === level)) {
      return showToast("A level with the same name exists. Choose 'Add to existing level'.");
    }

    setSaving(true);
    try {
      await addDoc(collection(firestore, 'categories', categoryId, 'quizzes'), {
        question,
        options: filledOptions,
        correct_option: correctOption,
        reason,
        level,
        score: parseInt(score, 10),
        duration,
        startTime: startTime ? startTime.toLocaleString() : null,
        endTime: endTime ? endTime.toLocaleString() : null,
        creatorUid: getAuth().currentUser?.uid ?? null,
      });
      navigation.goBack();
    } catch (error) {
      showToast('Error creating quiz: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton disabled={saving} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <DatePicker
          open={picking !== null}
          date={(picking === 'start' ? startTime : endTime) || new Date()}
          onCancel={() => setPicking(null)}
          onConfirm={(date) => {
            (picking === 'start' ? setStartTime : setEndTime)(date);
            setPicking(null);
          }}
        />

        <Text style={styles.title}>Add Question</Text>

        <InputField
          label="Question :"
          placeholder="Enter the question"
          value={question}
          onChangeText={setQuestion}
        />

        <Text style={styles.label}>Options :</Text>
        {options.map((option, index) => (
          <View key={index} style={styles.optionRow}>
            <InputField
              style={styles.optionInput}
              placeholder={`Option ${index + 1}`}
              value={option}
              onChangeText={(text) => setOptionAt(index, text)}
            />
            {options.length > MIN_OPTIONS && (
              <TouchableOpacity style={styles.removeOption} onPress={() => removeOption(index)} hitSlop={8}>
                <Ionicons name="trash-outline" size={22} color={Colors.error} />
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity style={styles.addOption} onPress={() => setOptions((prev) => [...prev, ''])}>
          <Ionicons name="add-circle-outline" size={32} color={Colors.primary} />
          <Text style={styles.addOptionText}>Add Option</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Correct Option :</Text>
        <View style={styles.radioRow}>
          {options.map((_, index) => (
            <Radio
              key={index}
              label={`Option ${index + 1}`}
              active={correctIndex === index}
              onPress={() => setCorrectIndex(index)}
            />
          ))}
        </View>

        <InputField label="Reason :" placeholder="Enter Reason" value={reason} onChangeText={setReason} />

        <InputField
          label="Score :"
          placeholder="Enter Score"
          value={score}
          onChangeText={(text) => setScore(digitsOnly(text))}
          keyboardType="number-pad"
        />

        <View style={styles.radioRow}>
          <Radio label="Create New Level" active={!isExisting} onPress={() => chooseLevelMode(NEW_LEVEL)} />
          <Radio label="Add to existing level" active={isExisting} onPress={() => chooseLevelMode(EXISTING_LEVEL)} />
        </View>

        {isExisting ? (
          <>
            <Text style={styles.label}>Level :</Text>
            <View style={styles.levelSelect}>
              <Picker selectedValue={level} onValueChange={setLevel}>
                {availableLevels.map((item) => (
                  <Picker.Item key={item} label={item} value={item} />
                ))}
              </Picker>
            </View>
          </>
        ) : (
          <InputField label="Level :" placeholder="Enter Level" value={level} onChangeText={setLevel} />
        )}

        <Text style={styles.label}>Duration :</Text>
        <View style={[styles.levelSelect, isExisting && styles.timeFieldDisabled]}>
          <Picker selectedValue={String(duration)} onValueChange={setDuration} enabled={!isExisting}>
            <Picker.Item label="Select duration" value="" color={Colors.textPlaceholder} />
            {durationChoices.map((minutes) => (
              <Picker.Item key={minutes} label={`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`} value={String(minutes)} />
            ))}
          </Picker>
        </View>

        <View style={styles.timeRow}>
          <View style={styles.timeCol}>
            <Text style={styles.label}>Start Time :</Text>
            <TimeField
              value={formatTime(startTime)}
              placeholder="Select Start Time"
              disabled={isExisting}
              onPress={() => setPicking('start')}
            />
          </View>
          <View style={styles.timeCol}>
            <Text style={styles.label}>End Time :</Text>
            <TimeField
              value={formatTime(endTime)}
              placeholder="Select End Time"
              disabled={isExisting}
              onPress={() => setPicking('end')}
            />
          </View>
        </View>

        {loading ? (
          <Loader />
        ) : (
          <AppButton label="Create" onPress={handleCreateQuiz} variant="filled" loading={saving} style={styles.createButton} />
        )}
      </ScrollView>

      <Toast message={toastMessage} />
    </SafeAreaView>
  );
}
