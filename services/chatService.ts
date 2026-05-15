/** Placeholder until LangGraph / GPT-4o backend is connected */
export async function sendChatMessage(message: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return `Saga AI received: "${message}" — narrative agent coming soon.`;
}
