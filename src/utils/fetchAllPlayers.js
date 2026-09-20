import { collection, getDocs } from 'firebase/firestore';

/** Every registered player: { id (= auth uid), name }. Guests use this to browse player history. */
export async function fetchAllPlayers(firestore) {
  const snapshot = await getDocs(collection(firestore, 'players'));
  return snapshot.docs
    .filter((d) => d.data().name)
    .map((d) => ({ id: d.id, name: d.data().name }));
}
