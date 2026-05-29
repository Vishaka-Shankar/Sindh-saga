export type AIStory = {
  id: string;
  title: string;
  description: string;
  imageSource: any;
};

export const AI_STORIES: AIStory[] = [
  {
    id: '1',
    title: 'The Brave Fisher of Keenjhar',
    description: 'A child-friendly tale from the shores of Sindh, ready to listen or read aloud.',
    imageSource: require('../assets/images/folk-singing.jpg'),
  },
  {
    id: '2',
    title: 'Ajrak and the Desert Wind',
    description: 'Folklore woven with Sindhi tradition and gentle wonder for young listeners.',
    imageSource: require('../assets/images/ajrak.jpg'),
  },
  {
    id: '3',
    title: 'The Mango Tree Promise',
    description: 'A warm family story about memory, harvest, and keeping heritage alive.',
    imageSource: require('../assets/images/thar-food.jpg'),
  },
];
