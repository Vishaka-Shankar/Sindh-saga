/** Energy points / learning quests — backed by Firestore */
export async function getUserPoints(_userId: string): Promise<number> {
  return 0;
}

export async function awardQuestPoints(_userId: string, _questId: string): Promise<void> {
  // Firestore transaction
}
