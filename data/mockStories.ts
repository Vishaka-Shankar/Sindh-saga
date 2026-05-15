/**
 * mockStories.ts
 * Static demo data for the university submission build.
 * Replace with Firestore + API data in a later sprint.
 */

export type MockStory = {
  id: string;
  title: string;
  excerpt: string;
  transcript: string;
  storyText: string;
  recordedAt: string;
  duration: string;
};

export const MOCK_USER = {
  name: 'Demo Student',
  email: 'student@szabist.edu.pk',
  storiesRecorded: 3,
  heritagePoints: 120,
};

export const MOCK_STORIES: MockStory[] = [
  {
    id: '1',
    title: 'The Brave Fisher of Keenjhar',
    excerpt: 'A child-friendly tale from the shores of Sindh…',
    transcript:
      'Hik rozi, Keenjhar jheel kinaare ik saana machhi wargo muhinjo dost rahiyo…',
    storyText:
      'Once upon a time, beside the beautiful Keenjhar Lake, a kind young fisherman named Soomro loved sharing stories with children. One windy evening, he helped a lost boat find its way home. The village celebrated his courage, and the children learned that bravery means helping others—even when you feel afraid.',
    recordedAt: '12 May 2026',
    duration: '2:14',
  },
  {
    id: '2',
    title: 'Ajrak and the Desert Wind',
    excerpt: 'Folklore woven with Sindhi tradition…',
    transcript: 'Ajrak rang mein ik purani kahani chhupi aahe…',
    storyText:
      'In a small desert town, Grandmother Fatima taught her granddaughter how every pattern on an Ajrak scarf tells a story of the Indus. When the desert wind whispered at night, the colors seemed to dance. The girl promised to keep Sindhi stories alive by sharing them with friends at school.',
    recordedAt: '10 May 2026',
    duration: '1:48',
  },
  {
    id: '3',
    title: 'The Mango Tree Promise',
    excerpt: 'A sweet story about family and memory…',
    transcript: 'Amma ji aam ji chhaan tale bethi kahani sunae…',
    storyText:
      'Under the old mango tree, Amma told her grandchildren about summers when the whole family gathered for harvest. They made a promise: every year, one child would record a new story so their heritage would never be forgotten. SindhSaga helps keep that promise alive.',
    recordedAt: '8 May 2026',
    duration: '3:02',
  },
];

export function getMockStoryById(id: string): MockStory | undefined {
  return MOCK_STORIES.find((s) => s.id === id);
}
