/**
 * pointsService.ts — Energy Points Economy
 *
 * Manages user energy points for the SindhSaga gamification system.
 * Points are awarded for story uploads, approvals, and learning quests.
 */

import { addDoc, collection, doc, getDoc, increment, serverTimestamp, updateDoc } from 'firebase/firestore';

import { getFirestoreDb } from '@/firebase/firestore';

export const POINT_VALUES = {
  STORY_UPLOADED: 50,
  STORY_APPROVED: 100,
  QUEST_COMPLETED: 30,
} as const;

/**
 * Fetch user's current energy points from Firestore.
 *
 * @param userId - The user's Firebase Auth UID
 * @returns Current energy points (default 0 if user document doesn't exist)
 */
export async function getUserPoints(userId: string): Promise<number> {
  const db = getFirestoreDb();
  if (!db) return 0;

  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return 0;

    const data = userDoc.data();
    return (data?.energyPoints as number) ?? 0;
  } catch (error) {
    console.error('Error fetching user points:', error);
    return 0;
  }
}

/**
 * Award points to a user and record the transaction in history.
 *
 * @param userId - The user's Firebase Auth UID
 * @param amount - Number of points to award (positive integer)
 * @param reason - Human-readable reason for the points award
 */
export async function addPoints(userId: string, amount: number, reason: string): Promise<void> {
  const db = getFirestoreDb();
  if (!db) throw new Error('Firestore is not available.');

  try {
    // Increment energy points on user document
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      energyPoints: increment(amount),
    });

    // Add entry to points history subcollection
    const historyRef = collection(db, 'users', userId, 'pointsHistory');
    await addDoc(historyRef, {
      amount,
      reason,
      awardedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding points:', error);
    throw error;
  }
}

/**
 * Award quest points (legacy function for backward compatibility).
 *
 * @deprecated Use addPoints() instead with POINT_VALUES.QUEST_COMPLETED
 */
export async function awardQuestPoints(userId: string, questId: string): Promise<void> {
  await addPoints(userId, POINT_VALUES.QUEST_COMPLETED, `Quest completed: ${questId}`);
}
