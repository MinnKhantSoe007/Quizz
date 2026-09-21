import React, { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colors } from "../theme/theme";

/**
 * Props: open, date, onConfirm(date), onCancel().
 * iOS has a native datetime spinner; Android has none, so it chains the date and time dialogs.
 */
export default function DateTimePickerModal({
  open,
  date,
  onConfirm,
  onCancel,
}) {
  const [draft, setDraft] = useState(date);
  const [androidStep, setAndroidStep] = useState("date");

  useEffect(() => {
    if (open) {
      setDraft(date);
      setAndroidStep("date");
    }
  }, [open]);

  if (!open) return null;

  if (Platform.OS === "android") {
    return (
      <DateTimePicker
        value={draft}
        mode={androidStep}
        onChange={(event, picked) => {
          if (event.type === "dismissed" || !picked) return onCancel();
          if (androidStep === "date") {
            setDraft(picked);
            return setAndroidStep("time");
          }
          onConfirm(picked);
        }}
      />
    );
  }

  return (
    <Modal transparent animationType="slide" visible onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.actions}>
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onConfirm(draft)}>
              <Text style={styles.confirm}>Confirm</Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={draft}
            mode="datetime"
            display="spinner"
            onChange={(_, picked) => picked && setDraft(picked)}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  cancel: { fontSize: 16, color: Colors.textSecondary },
  confirm: { fontSize: 16, fontWeight: "600", color: Colors.primary },
});
