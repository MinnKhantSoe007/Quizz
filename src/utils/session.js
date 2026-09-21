import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'lastRole';

/** Which role ('player' | 'quizzer') the signed-in user last entered; drives auto-login on launch. */
export const rememberRole = (role) => AsyncStorage.setItem(KEY, role);
export const recallRole = () => AsyncStorage.getItem(KEY);
export const forgetRole = () => AsyncStorage.removeItem(KEY);
