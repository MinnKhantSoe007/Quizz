import { collection, getDocs, doc } from 'firebase/firestore';

export const PLAYER_YEARS = ['1st year', '2nd year', '3rd year', '4th year', '5th year', '6th year'];

/**
 * Flattens every player across every year subcollection into one array,
 * so screens can look a player up by name+password without a year picker.
 * Returns { playerId, year, id, name, password } records.
 */
export async function fetchAllPlayers(firestore) {
  const playersSnapshot = await getDocs(collection(firestore, 'players'));
  const allPlayers = [];

  for (const playerDoc of playersSnapshot.docs) {
    const playerId = playerDoc.id;

    for (const year of PLAYER_YEARS) {
      const yearsSnapshot = await getDocs(collection(doc(firestore, 'players', playerId), year));
      yearsSnapshot.forEach((yearDoc) => {
        const { name, password } = yearDoc.data();
        allPlayers.push({ playerId, year, id: yearDoc.id, name, password });
      });
    }
  }

  return allPlayers;
}
