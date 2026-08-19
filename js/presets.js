// Presets & Data - Accurate Match to User Screenshots

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
];

const DEFAULT_STORY_IMAGES = [
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&auto=format&fit=crop&q=80',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Reliance_Digital_logo.svg/220px-Reliance_Digital_logo.svg.png',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format&fit=crop&q=80'
];

const RANDOM_USERNAMES = [
  { username: 'emily.clarke', name: 'Emily Clarke', verified: true, reaction: '❤️', ring: 'gradient' },
  { username: 'lucas_mendez', name: 'Lucas Méndez', verified: false, reaction: '🔥', ring: 'none' },
  { username: 'sophia.vibe', name: 'Sophia Miller', verified: true, reaction: '😍', ring: 'gradient' },
  { username: 'alexander.k', name: 'Alex Knight', verified: false, reaction: '', ring: 'none' },
  { username: 'chloe_lifestyle', name: 'Chloé Dupuis', verified: false, reaction: '👏', ring: 'close_friends' },
  { username: 'aryan.01', name: 'Aryan Sharma', verified: false, reaction: '', ring: 'none' },
  { username: 'priya_k', name: 'Priya Kulkarni', verified: true, reaction: '❤️', ring: 'gradient' }
];

const PRESETS = {
  standard: {
    name: '92 Views',
    statusBar: { time: '11:35', signal: 4, network: 'wifi', battery: 35, silent: true, showBatteryNum: true },
    story: { image: DEFAULT_STORY_IMAGES[0], viewsCount: '92', showPill: true },
    tabViewersCount: '92',
    stats: {
      views: 92, interactions: 2, profileActivity: 0,
      followersPct: 97.8, nonfollowersPct: 2.2,
      reached: 90, likes: 2, replies: '0', shares: '--'
    },
    viewers: [
      { username: 'emily.clarke', name: 'Emily Clarke', verified: true, reaction: '❤️', ring: 'gradient', avatar: DEFAULT_AVATARS[0] }
    ]
  },
  preset68: {
    name: '68 Views',
    statusBar: { time: '11:35', signal: 4, network: 'wifi', battery: 35, silent: true, showBatteryNum: true },
    story: { image: DEFAULT_STORY_IMAGES[1], viewsCount: '68', showPill: true },
    tabViewersCount: '68',
    stats: {
      views: 68, interactions: 0, profileActivity: 2,
      followersPct: 98.5, nonfollowersPct: 1.5,
      reached: 65, likes: 0, replies: '0', shares: '--'
    },
    viewers: []
  },
  preset44: {
    name: '44 Views',
    statusBar: { time: '11:35', signal: 4, network: 'wifi', battery: 35, silent: true, showBatteryNum: true },
    story: { image: DEFAULT_STORY_IMAGES[2], viewsCount: '44', showPill: true },
    tabViewersCount: '44',
    stats: {
      views: 44, interactions: 3, profileActivity: 0,
      followersPct: 100, nonfollowersPct: 0,
      reached: 44, likes: 3, replies: '0', shares: '--'
    },
    viewers: []
  },
  preset625: {
    name: '625 Views (Dark)',
    theme: 'dark',
    statusBar: { time: '12:27', signal: 4, network: 'wifi', battery: 100, silent: true, showBatteryNum: true },
    story: { image: DEFAULT_STORY_IMAGES[1], viewsCount: '479', showPill: true },
    tabViewersCount: '479',
    stats: {
      views: 625, interactions: 4, profileActivity: 2,
      followersPct: 98.2, nonfollowersPct: 1.8,
      reached: 605, likes: 4, replies: '0', shares: '--'
    },
    viewers: [
      { username: 'emily.clarke', name: 'Emily Clarke', verified: true, reaction: '❤️', ring: 'gradient', avatar: DEFAULT_AVATARS[0] },
      { username: 'lucas_mendez', name: 'Lucas Méndez', verified: false, reaction: '🔥', ring: 'none', avatar: DEFAULT_AVATARS[1] }
    ]
  },
  preset767: {
    name: '767 Views (479)',
    theme: 'dark',
    statusBar: { time: '10:05', signal: 3, network: '5G', battery: 80, silent: false, showBatteryNum: false },
    story: { image: DEFAULT_STORY_IMAGES[1], viewsCount: '479', showPill: true },
    tabViewersCount: '479',
    stats: {
      views: 767, interactions: 12, profileActivity: 2,
      followersPct: 1.1, nonfollowersPct: 98.9,
      reached: 645, likes: 9, replies: '3', shares: '--'
    },
    viewers: [
      { username: 'emily.clarke', name: 'Emily Clarke', verified: true, reaction: '❤️', ring: 'gradient', avatar: DEFAULT_AVATARS[0] },
      { username: 'lucas_mendez', name: 'Lucas Méndez', verified: false, reaction: '🔥', ring: 'none', avatar: DEFAULT_AVATARS[1] }
    ]
  },
  viral: {
    name: '10K Views',
    statusBar: { time: '11:35', signal: 4, network: '5G', battery: 78, silent: false, showBatteryNum: true },
    story: { image: DEFAULT_STORY_IMAGES[0], viewsCount: '10.4K', showPill: true },
    tabViewersCount: '10.4K',
    stats: {
      views: 10420, interactions: 540, profileActivity: 210,
      followersPct: 12.4, nonfollowersPct: 87.6,
      reached: 9800, likes: 480, replies: '42', shares: '18'
    },
    viewers: [
      { username: 'emily.clarke', name: 'Emily Clarke', verified: true, reaction: '❤️', ring: 'gradient', avatar: DEFAULT_AVATARS[0] },
      { username: 'lucas_mendez', name: 'Lucas Méndez', verified: false, reaction: '🔥', ring: 'none', avatar: DEFAULT_AVATARS[1] }
    ]
  }
};
