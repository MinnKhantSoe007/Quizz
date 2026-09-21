import * as LocalAuthentication from 'expo-local-authentication';

/** Face ID / Touch ID / passcode prompt. Resolves true on success, or when the device has no lock to check. */
export async function authenticateDevice(promptMessage) {
  const level = await LocalAuthentication.getEnrolledLevelAsync();
  if (level === LocalAuthentication.SecurityLevel.NONE) return true;
  const { success } = await LocalAuthentication.authenticateAsync({ promptMessage });
  return success;
}
