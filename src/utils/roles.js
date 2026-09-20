import { collection, doc, getDoc, getDocs, limit, query, setDoc, where } from 'firebase/firestore';
import { FIREBASE_FIRESTORE as firestore } from '../../firebaseConfig';

/** role: 'quizzer' | 'player'. Quizzers created before roles existed count until their next login. */
export async function hasRole(uid, role) {
  if ((await getDoc(doc(firestore, 'roles', uid))).data()?.[role]) return true;
  if (role !== 'quizzer') return false;

  const legacy = await getDocs(query(collection(firestore, 'users'), where('creatorUid', '==', uid), limit(1)));
  return !legacy.empty;
}

/**
 * Quizzer grants carry the secure code; Firestore rules compare it with config/quizzer,
 * so a wrong code rejects with `permission-denied`. Also refreshes the code on login,
 * which is how rotating it server-side forces quizzers to re-enter it.
 */
export const grantRole = (uid, role, secureCode) =>
  setDoc(doc(firestore, 'roles', uid), { [role]: true, ...(role === 'quizzer' && { secureCode }) }, { merge: true });

export const isWrongCode = (error) => error?.code === 'permission-denied';

/** Checks the typed code against the server without needing an account (see codeCheck rule). */
export async function verifyQuizzerCode(secureCode) {
  try {
    await getDoc(doc(firestore, 'codeCheck', secureCode.trim()));
    return true;
  } catch (error) {
    if (isWrongCode(error)) return false;
    throw error;
  }
}
