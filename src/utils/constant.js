import { Dimensions } from "react-native";


export const DIMENSIONS = Dimensions.get("window");

// Quiz form
export const MIN_OPTIONS = 3;
export const DURATION_MINUTES = [...Array(60)].map((_, i) => i + 1).concat([75, 90, 105, 120, 150, 180]);
export const LEVEL_MODE = { NEW: 'new', EXISTING: 'existing' };
