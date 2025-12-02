export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  description: string;
  orientation: 'portrait' | 'landscape';
}

export interface Season {
  seasonNumber: number;
  episodes: Episode[];
}

export interface Series {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  category: string;
  views: number;
  likes: number;
  uploadDate: string;
  seasons: Season[];
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  views: number;
  likes: number;
  category: string;
  description: string;
  uploadDate: string;
  orientation: 'portrait' | 'landscape';
  releaseDate?: string;
}

export const videos: Video[] = [
  {
    id: '1',
    title: 'Betrayed by Love',
    thumbnail: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=700&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 60,
    views: 2400000,
    likes: 145000,
    category: 'Drama',
    description: 'A tale of betrayal and redemption',
    uploadDate: '2024-01-15',
    orientation: 'portrait',
  },
  {
    id: '2',
    title: 'Hidden Identity',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=700&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: 58,
    views: 1800000,
    likes: 98000,
    category: 'Thriller',
    description: 'Uncovering a dangerous secret',
    uploadDate: '2024-01-14',
    orientation: 'landscape',
  },
  {
    id: '3',
    title: 'CEO\'s Secret Wife',
    thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=700&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: 62,
    views: 3200000,
    likes: 187000,
    category: 'Romance',
    description: 'A billionaire\'s hidden marriage',
    uploadDate: '2024-01-13',
    orientation: 'portrait',
  },
  {
    id: '4',
    title: 'Revenge Plan',
    thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=700&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: 55,
    views: 1500000,
    likes: 92000,
    category: 'Action',
    description: 'Justice will be served',
    uploadDate: '2024-01-12',
    orientation: 'landscape',
  },
  {
    id: '5',
    title: 'Lost Memories',
    thumbnail: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=700&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    duration: 59,
    views: 2100000,
    likes: 124000,
    category: 'Drama',
    description: 'Searching for the past',
    uploadDate: '2024-01-11',
    orientation: 'portrait',
  },
  {
    id: '6',
    title: 'Double Life',
    thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=700&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    duration: 61,
    views: 1900000,
    likes: 110000,
    category: 'Thriller',
    description: 'Living two different lives',
    uploadDate: '2024-01-10',
    orientation: 'landscape',
  },
  {
    id: '7',
    title: 'Forbidden Love',
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=700&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    duration: 57,
    views: 2800000,
    likes: 156000,
    category: 'Romance',
    description: 'A love that cannot be',
    uploadDate: '2024-01-09',
    orientation: 'portrait',
  },
  {
    id: '8',
    title: 'Mystery Heir',
    thumbnail: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&h=700&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    duration: 60,
    views: 1700000,
    likes: 95000,
    category: 'Drama',
    description: 'Inheriting a fortune and secrets',
    uploadDate: '2024-01-08',
    orientation: 'landscape',
  },
  {
    id: '9',
    title: 'Deadly Game',
    thumbnail: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&h=700&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: 63,
    views: 2200000,
    likes: 132000,
    category: 'Action',
    description: 'Survival at any cost',
    uploadDate: '2024-01-07',
    orientation: 'portrait',
  },
  {
    id: '10',
    title: 'Undercover Boss',
    thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=700&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 56,
    views: 2600000,
    likes: 148000,
    category: 'Comedy',
    description: 'A CEO in disguise',
    uploadDate: '2024-01-06',
    orientation: 'landscape',
  },
  {
    id: '11',
    title: 'Time Traveler',
    thumbnail: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=700&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: 64,
    views: 1600000,
    likes: 89000,
    category: 'Thriller',
    description: 'Changing the future',
    uploadDate: '2024-01-05',
    orientation: 'portrait',
  },
  {
    id: '12',
    title: 'Second Chance',
    thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=700&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: 58,
    views: 2300000,
    likes: 140000,
    category: 'Romance',
    description: 'Love finds a way back',
    uploadDate: '2024-01-04',
    orientation: 'landscape',
  },
];

export const categories = ['All', 'Drama', 'Romance', 'Thriller', 'Comedy', 'Action'];

export const series: Series[] = [
  {
    id: 's1',
    title: 'Betrayed by Love',
    thumbnail: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=700&fit=crop',
    description: 'A gripping tale of betrayal and redemption across 20 episodes',
    category: 'Drama',
    views: 5600000,
    likes: 425000,
    uploadDate: '2024-01-15',
    seasons: [
      {
        seasonNumber: 1,
        episodes: [
          {
            id: 's1e1',
            episodeNumber: 1,
            title: 'The Beginning',
            thumbnail: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=700&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            duration: 60,
            description: 'The journey begins',
            orientation: 'portrait',
          },
          {
            id: 's1e2',
            episodeNumber: 2,
            title: 'First Betrayal',
            thumbnail: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=700&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            duration: 58,
            description: 'Trust is broken',
            orientation: 'portrait',
          },
          {
            id: 's1e3',
            episodeNumber: 3,
            title: 'Uncovering Secrets',
            thumbnail: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=700&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            duration: 62,
            description: 'Hidden truths emerge',
            orientation: 'portrait',
          },
          {
            id: 's1e4',
            episodeNumber: 4,
            title: 'The Confrontation',
            thumbnail: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=700&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            duration: 59,
            description: 'Face to face with the enemy',
            orientation: 'portrait',
          },
          {
            id: 's1e5',
            episodeNumber: 5,
            title: 'The Path Forward',
            thumbnail: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=700&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            duration: 61,
            description: 'Finding a new way',
            orientation: 'portrait',
          },
        ],
      },
      {
        seasonNumber: 2,
        episodes: [
          {
            id: 's2e1',
            episodeNumber: 1,
            title: 'New Beginnings',
            thumbnail: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=700&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            duration: 63,
            description: 'A fresh start',
            orientation: 'portrait',
          },
          {
            id: 's2e2',
            episodeNumber: 2,
            title: 'Old Enemies Return',
            thumbnail: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=700&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            duration: 57,
            description: 'The past comes back',
            orientation: 'portrait',
          },
          {
            id: 's2e3',
            episodeNumber: 3,
            title: 'The Final Battle',
            thumbnail: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=700&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            duration: 60,
            description: 'The ultimate showdown',
            orientation: 'portrait',
          },
        ],
      },
    ],
  },
  {
    id: 's2',
    title: 'Hidden Identity',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=700&fit=crop',
    description: 'Uncovering a dangerous secret identity thriller',
    category: 'Thriller',
    views: 4200000,
    likes: 320000,
    uploadDate: '2024-01-14',
    seasons: [
      {
        seasonNumber: 1,
        episodes: [
          {
            id: 's2s1e1',
            episodeNumber: 1,
            title: 'The Mystery Man',
            thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=700&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            duration: 58,
            description: 'Who is he really?',
            orientation: 'landscape',
          },
          {
            id: 's2s1e2',
            episodeNumber: 2,
            title: 'The Investigation',
            thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=700&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            duration: 61,
            description: 'Digging deeper',
            orientation: 'landscape',
          },
          {
            id: 's2s1e3',
            episodeNumber: 3,
            title: 'The Truth Revealed',
            thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=700&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            duration: 59,
            description: 'Everything changes',
            orientation: 'landscape',
          },
          {
            id: 's2s1e4',
            episodeNumber: 4,
            title: 'Point of No Return',
            thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=700&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            duration: 62,
            description: 'Cannot go back now',
            orientation: 'landscape',
          },
        ],
      },
    ],
  },
  {
    id: 's3',
    title: 'Lost Memories',
    thumbnail: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=700&fit=crop',
    description: 'A journey through forgotten memories searching for the past',
    category: 'Drama',
    views: 3800000,
    likes: 290000,
    uploadDate: '2024-01-11',
    seasons: [
      {
        seasonNumber: 1,
        episodes: [
          {
            id: 's3e1',
            episodeNumber: 1,
            title: 'Awakening',
            thumbnail: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=700&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            duration: 55,
            description: 'Who am I?',
            orientation: 'portrait',
          },
          {
            id: 's3e2',
            episodeNumber: 2,
            title: 'Fragments',
            thumbnail: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=700&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            duration: 57,
            description: 'Pieces of the past',
            orientation: 'portrait',
          },
          {
            id: 's3e3',
            episodeNumber: 3,
            title: 'Recognition',
            thumbnail: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=700&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            duration: 60,
            description: 'Memories return',
            orientation: 'portrait',
          },
        ],
      },
    ],
  },
  {
    id: 's4',
    title: 'Double Life',
    thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=700&fit=crop',
    description: 'Living two different lives at the same time',
    category: 'Thriller',
    views: 4500000,
    likes: 350000,
    uploadDate: '2024-01-10',
    seasons: [
      {
        seasonNumber: 1,
        episodes: [
          {
            id: 's4e1',
            episodeNumber: 1,
            title: 'The Split',
            thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=700&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            duration: 61,
            description: 'Two lives begin',
            orientation: 'landscape',
          },
          {
            id: 's4e2',
            episodeNumber: 2,
            title: 'Balancing Act',
            thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=700&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            duration: 58,
            description: 'Keeping both worlds apart',
            orientation: 'landscape',
          },
          {
            id: 's4e3',
            episodeNumber: 3,
            title: 'Collision Course',
            thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=700&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            duration: 63,
            description: 'When worlds collide',
            orientation: 'landscape',
          },
        ],
      },
    ],
  },
];
