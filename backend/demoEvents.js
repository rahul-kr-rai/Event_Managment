// Demo events seeded into the database for development/demo purposes.
// This file is used by server.js during startup to ensure consistent demo data.

module.exports = [
  // Live events (6)
  {
    title: 'Live: React Conference 2026',
    date: '2026-03-20',
    time: '10:00 AM',
    location: 'Online',
    price: 0,
    capacity: 150,
    category: 'Tech',
    mode: 'online',
    status: 'live',
    description: 'Join industry experts for talks and networking around React, Remix, and modern frontend development.',
    imageUrl: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Live: Design Thinking Workshop',
    date: '2026-03-18',
    time: '02:00 PM',
    location: 'Main Auditorium',
    price: 20,
    capacity: 75,
    category: 'Workshop',
    mode: 'onsite',
    status: 'live',
    description: 'A hands-on workshop to build empathy and user-centric product ideas using design thinking exercises.',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Live: Startup Pitch Night',
    date: '2026-03-19',
    time: '06:30 PM',
    location: 'Auditorium B',
    price: 10,
    capacity: 100,
    category: 'Business',
    mode: 'onsite',
    status: 'live',
    description: 'Pitch your startup idea to mentors and investors in a fast‑paced evening event.',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Live: Yoga & Wellness Session',
    date: '2026-03-18',
    time: '08:00 AM',
    location: 'Wellness Center',
    price: 5,
    capacity: 60,
    category: 'Health',
    mode: 'onsite',
    status: 'live',
    description: 'Start your day with guided yoga and mindfulness practices to recharge your energy.',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Live: AI Ethics Panel',
    date: '2026-03-20',
    time: '04:00 PM',
    location: 'Lecture Hall 3',
    price: 0,
    capacity: 120,
    category: 'Tech',
    mode: 'onsite',
    status: 'live',
    description: 'Industry leaders discuss responsible AI, bias mitigation, and the future of regulation.',
    imageUrl: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Live: Coding Jam (Hackathon)',
    date: '2026-03-18',
    time: '05:00 PM',
    location: 'Lab 2',
    price: 0,
    capacity: 80,
    category: 'Tech',
    mode: 'onsite',
    status: 'live',
    description: 'Collaborate on mini coding challenges and build quick demos with fellow developers.',
    imageUrl: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=800&q=80'
  },
  // Upcoming events (5)
  {
    title: 'Upcoming: Cloud Native Meetup',
    date: '2026-04-05',
    time: '06:00 PM',
    location: 'Conference Room A',
    price: 15,
    capacity: 120,
    category: 'Tech',
    mode: 'onsite',
    status: 'upcoming',
    description: 'Learn about building resilient cloud-native applications using Kubernetes and microservices.',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Upcoming: Photography Walk',
    date: '2026-04-02',
    time: '09:00 AM',
    location: 'City Park',
    price: 0,
    capacity: 40,
    category: 'Creative',
    mode: 'onsite',
    status: 'upcoming',
    description: 'A guided photography walk to capture stunning landscapes and urban scenes.',
    imageUrl: 'https://images.unsplash.com/photo-1534081333815-ae5019106622?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Upcoming: Career Fair',
    date: '2026-04-10',
    time: '10:00 AM',
    location: 'Exhibition Hall',
    price: 0,
    capacity: 250,
    category: 'Career',
    mode: 'onsite',
    status: 'upcoming',
    description: 'Meet recruiters from top companies and explore internship and job opportunities.',
    imageUrl: 'https://images.unsplash.com/photo-1558934354-02b0b2c9e9ee?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Upcoming: UX Design Crash Course',
    date: '2026-04-08',
    time: '01:00 PM',
    location: 'Online',
    price: 25,
    capacity: 100,
    category: 'Design',
    mode: 'online',
    status: 'upcoming',
    description: 'A fast-paced workshop covering UX fundamentals, prototyping, and user research techniques.',
    imageUrl: 'https://images.unsplash.com/photo-1587614382346-ac123e16b775?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Upcoming: Blockchain 101',
    date: '2026-04-12',
    time: '03:00 PM',
    location: 'Lecture Hall 1',
    price: 10,
    capacity: 80,
    category: 'Tech',
    mode: 'onsite',
    status: 'upcoming',
    description: 'An introductory session on blockchain fundamentals, smart contracts, and real-world use cases.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  }
];
