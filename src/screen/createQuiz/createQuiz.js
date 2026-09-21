import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, updateDoc, deleteDoc, onSnapshot, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FIREBASE_FIRESTORE as firestore } from '../../../firebaseConfig';
import AppButton from '../../components/AppButton';
import BackButton from '../../components/BackButton';
import ConfirmDialog from '../../components/ConfirmDialog';
import DateTimeField from '../../components/DateTimeField';
import DateTimePickerModal from '../../components/DateTimePickerModal';
import InputField from '../../components/InputField';
import Loader from '../../components/Loader';
import RadioOption from '../../components/RadioOption';
import SelectField from '../../components/SelectField';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { Colors } from '../../theme/theme';
import { DURATION_MINUTES, LEVEL_MODE, MIN_OPTIONS } from '../../utils/constant';
import { authenticateDevice } from '../../utils/localAuth';
import { digitsOnly, formatDateTime, parseDateTime } from '../../utils/format';
import { styles } from './style';

// Filled options first, padded with blank slots up to the minimum.
const toOptionSlots = (saved = []) => {
  const filled = saved.filter(Boolean);
  return [...filled, ...Array(Math.max(0, MIN_OPTIONS - filled.length)).fill('')];
};

/** Add Question form. Pass `quiz` in route params to edit that question instead. */
export default function CreateQuiz({ route, navigation }) {
  const { categoryId, quiz } = route.params;
  const isEdit = !!quiz;
  const initialOptions = toOptionSlots(quiz?.options);

  const [question, setQuestion] = useState(quiz?.question ?? '');
  const [options, setOptions] = useState(initialOptions);
  const [correctIndex, setCorrectIndex] = useState(Math.max(0, initialOptions.indexOf(quiz?.correct_option)));
  const [reason, setReason] = useState(quiz?.reason ?? '');
  const [score, setScore] = useState(quiz ? String(quiz.score) : '');
  const [levelMode, setLevelMode] = useState(isEdit ? LEVEL_MODE.EXISTING : LEVEL_MODE.NEW);
  const [level, setLevel] = useState(quiz?.level ?? '');
  const [duration, setDuration] = useState(quiz ? String(quiz.duration) : '');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [picking, setPicking] = useState(null); // 'start' | 'end' | null
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [availableLevels, setAvailableLevels] = useState([]);
  const { toastMessage, showToast } = useToast();

  const isExisting = levelMode === LEVEL_MODE.EXISTING;

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
      setDuration(String(selected.duration));
      setStartTime(parseDateTime(selected.startTime));
      setEndTime(parseDateTime(selected.endTime));
    }
  }, [isExisting, level, quizData]);

  const chooseLevelMode = (mode) => {
    setLevelMode(mode);
    setLevel(mode === LEVEL_MODE.EXISTING ? availableLevels[0] || '' : '');
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

  const handleSave = async () => {
    const filledOptions = options.map((option) => option.trim()).filter(Boolean);
    const correctOption = options[correctIndex].trim();

    if (!question.trim() || !level.trim() || !score.trim() || !duration.trim()) {
      return showToast('Please fill in related fields.');
    }
    if (filledOptions.length < 2 || !correctOption) {
      return showToast('Add at least two options and pick a filled one as correct.');
    }
    if (startTime && endTime && endTime <= startTime) {
      return showToast('End time must be greater than start time.');
    }
    if (!isExisting && quizData.some((item) => item.level === level)) {
      return showToast("A level with the same name exists. Choose 'Add to existing level'.");
    }

    const data = {
      question,
      options: filledOptions,
      correct_option: correctOption,
      reason,
      level,
      score: parseInt(score, 10),
      duration,
      startTime: startTime ? startTime.toISOString() : null,
      endTime: endTime ? endTime.toISOString() : null,
    };

    setSaving(true);
    try {
      if (isEdit) {
        await updateDoc(doc(firestore, 'categories', categoryId, 'quizzes', quiz.id), data);
      } else {
        await addDoc(collection(firestore, 'categories', categoryId, 'quizzes'), {
          ...data,
          creatorUid: getAuth().currentUser?.uid ?? null,
        });
      }
      navigation.goBack();
    } catch (error) {
      showToast(`Error saving question: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setConfirmDelete(false);
    setSaving(true);
    try {
      if (!(await authenticateDevice('Authenticate to delete this question'))) {
        return showToast('Authentication failed. Question not deleted.');
      }
      await deleteDoc(doc(firestore, 'categories', categoryId, 'quizzes', quiz.id));
      navigation.goBack();
    } catch (error) {
      showToast(`Error deleting question: ${error.message}`);
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
        <DateTimePickerModal
          open={picking !== null}
          date={(picking === 'start' ? startTime : endTime) || new Date()}
          onCancel={() => setPicking(null)}
          onConfirm={(date) => {
            (picking === 'start' ? setStartTime : setEndTime)(date);
            setPicking(null);
          }}
        />

        <Text style={styles.title}>{isEdit ? 'Edit Question' : 'Add Question'}</Text>

        <InputField label="Question :" placeholder="Enter the question" value={question} onChangeText={setQuestion} />

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
            <RadioOption
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
          <RadioOption label="Create New Level" active={!isExisting} onPress={() => chooseLevelMode(LEVEL_MODE.NEW)} />
          <RadioOption label="Add to existing level" active={isExisting} onPress={() => chooseLevelMode(LEVEL_MODE.EXISTING)} />
        </View>

        {isExisting ? (
          <SelectField
            label="Level :"
            value={level}
            onChange={setLevel}
            items={availableLevels.map((item) => ({ label: item, value: item }))}
          />
        ) : (
          <InputField label="Level :" placeholder="Enter Level" value={level} onChangeText={setLevel} />
        )}

        <SelectField
          label="Duration :"
          value={duration}
          onChange={setDuration}
          placeholder="Select duration"
          disabled={isExisting}
          items={durationChoices.map((minutes) => ({
            label: `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`,
            value: String(minutes),
          }))}
        />

        <View style={styles.timeRow}>
          <View style={styles.timeCol}>
            <Text style={styles.label}>Start Time :</Text>
            <DateTimeField
              value={formatDateTime(startTime)}
              placeholder="Select Start Time"
              disabled={isExisting}
              onPress={() => setPicking('start')}
            />
          </View>
          <View style={styles.timeCol}>
            <Text style={styles.label}>End Time :</Text>
            <DateTimeField
              value={formatDateTime(endTime)}
              placeholder="Select End Time"
              disabled={isExisting}
              onPress={() => setPicking('end')}
            />
          </View>
        </View>

        {loading ? (
          <Loader />
        ) : (
          <>
            <AppButton
              label={isEdit ? 'Update' : 'Create'}
              onPress={handleSave}
              variant="filled"
              loading={saving}
              style={styles.primaryButton}
            />
            {isEdit && (
              <AppButton
                label="Delete"
                onPress={() => setConfirmDelete(true)}
                variant="outline"
                color={Colors.error}
                disabled={saving}
                style={styles.deleteButton}
              />
            )}
          </>
        )}
      </ScrollView>

      <ConfirmDialog
        visible={confirmDelete}
        message="This question will be permanently deleted."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />

      <Toast message={toastMessage} />
    </SafeAreaView>
  );
}
