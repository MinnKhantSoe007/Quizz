import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

/**
 * useImagePicker — shared profile-photo picker used by CreateAccount and
 * UpdateAccount. Tracks the most recently picked image's local uri.
 */
export function useImagePicker() {
  const [uri, setUri] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUri(result.assets[0].uri);
    }

    return result;
  };

  return { uri, pickImage };
}
