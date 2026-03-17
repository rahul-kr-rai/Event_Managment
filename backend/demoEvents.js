// Demo events seeded into the database for development/demo purposes.
// This file is used by server.js during startup to ensure consistent demo data.

module.exports = [
  // Live events
  {
    title: 'Global AI Summit 2026',
    date: '2026-03-25',
    time: '09:00 AM',
    location: 'Silicon Valley Convention Center',
    price: 499,
    capacity: 500,
    category: 'Technology',
    mode: 'onsite',
    status: 'live',
    description: 'Join thousands of developers, researchers, and tech enthusiasts at the Global AI Summit. Explore the latest advancements in artificial intelligence, machine learning, and neural networks. Features keynote speakers from top tech giants, hands-on workshops, and exclusive networking opportunities.',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Neon Nights Music Festival',
    date: '2026-03-28',
    time: '04:00 PM',
    location: 'Downtown Arena',
    price: 150,
    capacity: 2000,
    category: 'Entertainment',
    mode: 'onsite',
    status: 'live',
    description: 'Experience an unforgettable night of electronic dance music, stunning visual effects, and an electric atmosphere. Neon Nights brings together the world\'s top DJs and artists for a 10-hour non-stop party. Grab your tickets before they sell out!',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c092bb2138e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Culinary Masterclass: Italian Cuisine',
    date: '2026-03-22',
    time: '11:00 AM',
    location: 'Gourmet Kitchen Studio',
    price: 85,
    capacity: 30,
    category: 'Workshop',
    mode: 'onsite',
    status: 'live',
    description: 'Master the art of authentic Italian cooking in this exclusive masterclass. Learn how to make pasta from scratch, craft the perfect rich tomato sauce, and bake classic desserts. Ingredients, aprons, and wine tasting included.',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'City Marathon 2026',
    date: '2026-04-10',
    time: '06:00 AM',
    location: 'Central Park',
    price: 45,
    capacity: 5000,
    category: 'Sports',
    mode: 'onsite',
    status: 'live',
    description: 'Challenge yourself in the annual City Marathon! Whether you are aiming for a personal best or just want to enjoy a scenic run through the city streets, this event is perfect for runners of all levels. Includes a finisher medal and post-race refreshments.',
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Mindfulness & Yoga Retreat',
    date: '2026-04-05',
    time: '08:00 AM',
    location: 'Zen Garden Resort',
    price: 120,
    capacity: 50,
    category: 'Health',
    mode: 'onsite',
    status: 'live',
    description: 'Disconnect from the hustle and bustle of daily life and reconnect with your inner self. This full-day retreat includes guided meditation sessions, vinyasa yoga flow, sound bath healing, and a healthy organic lunch.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'TechHack 2026 (Hackathon)',
    date: '2026-04-15',
    time: '09:00 AM',
    location: 'Innovation Hub',
    price: 0,
    capacity: 300,
    category: 'Hackathon',
    mode: 'onsite',
    status: 'live',
    description: 'Bring your brightest ideas to life at TechHack 2026! Form a team, build innovative software solutions, and compete for $50,000 in prizes. Mentors from top tech companies will be available to guide you. Food and energy drinks provided!',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'
  },
  // Upcoming events
  {
    title: 'Startup Founders Pitch Deck',
    date: '2026-05-12',
    time: '05:00 PM',
    location: 'Grand Hotel Ballroom',
    price: 200,
    capacity: 150,
    category: 'Business',
    mode: 'onsite',
    status: 'upcoming',
    description: 'An exclusive evening for early-stage startup founders to pitch their ideas to a panel of top-tier venture capitalists and angel investors. A great opportunity to secure funding, receive valuable feedback, and network with industry leaders.',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Abstract Art Exhibition',
    date: '2026-05-20',
    time: '10:00 AM',
    location: 'Modern Art Gallery',
    price: 15,
    capacity: 400,
    category: 'Arts',
    mode: 'onsite',
    status: 'upcoming',
    description: 'Discover the mesmerizing world of abstract art featuring works from over 30 emerging and established contemporary artists. The exhibition explores themes of identity, space, and emotion through vibrant colors and unique textures.',
    imageUrl: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Career Fair: NextGen Leaders',
    date: '2026-06-05',
    time: '09:00 AM',
    location: 'University Expo Center',
    price: 0,
    capacity: 1500,
    category: 'Career',
    mode: 'onsite',
    status: 'upcoming',
    description: 'Kickstart your career at the NextGen Leaders Career Fair! Meet recruiters from Fortune 500 companies, dynamic startups, and non-profits. Bring your resume, practice your elevator pitch, and land your dream job or internship.',
    imageUrl: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Web3 & Blockchain Conference',
    date: '2026-06-15',
    time: '10:00 AM',
    location: 'Online',
    price: 50,
    capacity: 1000,
    category: 'Technology',
    mode: 'online',
    status: 'upcoming',
    description: 'Dive deep into the decentralized web. Learn about smart contracts, DeFi, NFTs, and the future of blockchain technology from industry pioneers. This virtual conference includes interactive Q&A sessions and virtual networking booths.',
    imageUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80'
  }
];
