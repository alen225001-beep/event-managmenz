// Seed data for Sahrdaya Campus Event & Ticket Booking Portal (EventHub)
// Student: Alen (alen225001@sahrdaya.ac.in)
// Institution: Sahrdaya College of Engineering & Technology, Kodakara, Thrissur

const users = [
  {
    name: 'Alen (Student Lead)',
    email: 'alen225001@sahrdaya.ac.in',
    password: 'password123',
    role: 'organizer',
    department: 'Computer Science & Engineering',
    studentId: 'alen225001',
    phone: '+91 98470 12345',
    clubName: 'IEEE Sahrdaya Student Branch',
  },
  {
    name: 'Prof. Campus Administrator',
    email: 'admin@sahrdaya.ac.in',
    password: 'password123',
    role: 'admin',
    department: 'General Administration',
    studentId: 'SCET-FAC-001',
    phone: '+91 94471 22334',
    clubName: 'College Event Council',
  },
  {
    name: 'IEDC Innovation Officer',
    email: 'iedc@sahrdaya.ac.in',
    password: 'password123',
    role: 'organizer',
    department: 'Artificial Intelligence & Data Science',
    studentId: 'SCET-IEDC-02',
    phone: '+91 98950 33445',
    clubName: 'Innovation & Entrepreneurship Development Centre (IEDC)',
  },
  {
    name: 'Anjali Menon',
    email: 'anjali@sahrdaya.ac.in',
    password: 'password123',
    role: 'student',
    department: 'Computer Science & Engineering',
    studentId: 'alen22cs042',
    phone: '+91 97451 98765',
    clubName: '',
  },
  {
    name: 'Rahul Varma',
    email: 'rahul@sahrdaya.ac.in',
    password: 'password123',
    role: 'student',
    department: 'Biomedical Engineering',
    studentId: 'alen22bm018',
    phone: '+91 94002 44556',
    clubName: '',
  },
];

const getFutureDate = (daysAhead) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d;
};

const events = [
  {
    title: "TechNovus '26: Annual National Inter-College Hackathon",
    description:
      'Join Sahrdaya’s flagship 24-hour coding sprint! Build cutting-edge solutions across AI/ML, Healthcare, Web3, and Smart Campus Automation. Mentorship from industry veterans from Cognizant and TCS, free meals, and ₹75,000 in cash prizes!',
    category: 'Hackathon',
    venue: 'Decennial Hall & Central Computing Facility (CCF)',
    date: getFutureDate(12),
    time: '09:00 AM (24-Hour Nonstop)',
    registrationDeadline: getFutureDate(8),
    capacity: 120,
    registeredCount: 84,
    bannerImage:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    clubName: 'IEEE Sahrdaya Student Branch',
    ticketType: 'free',
    price: 0,
    tags: ['hackathon', 'ai', 'coding', 'ieee', 'cash-prizes'],
    contactEmail: 'alen225001@sahrdaya.ac.in',
    contactPhone: '+91 98470 12345',
    status: 'upcoming',
  },
  {
    title: 'Hands-on Workshop: Deep Learning with PyTorch & Generative AI',
    description:
      'A full-day intensive hands-on masterclass for engineering students. Learn convolutional neural networks, transformer architectures, and fine-tuning open-source LLMs using Google Colab GPUs. Bring your laptops!',
    category: 'Technical Workshop',
    venue: 'Central Computing Facility - Lab 3',
    date: getFutureDate(5),
    time: '09:30 AM - 04:30 PM',
    registrationDeadline: getFutureDate(3),
    capacity: 60,
    registeredCount: 52,
    bannerImage:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    clubName: 'CSI Student Chapter',
    ticketType: 'free',
    price: 0,
    tags: ['pytorch', 'generative-ai', 'deep-learning', 'python', 'hands-on'],
    contactEmail: 'alen225001@sahrdaya.ac.in',
    contactPhone: '+91 98470 12345',
    status: 'upcoming',
  },
  {
    title: 'Sargam ’26: Annual Inter-Department Cultural Gala',
    description:
      'The biggest cultural festival of Sahrdaya College! Featuring eastern & western musical band face-offs, synchronized group dance battles, mime, theatrical skits, and celebrity musical night. Don’t miss your entry pass!',
    category: 'Cultural Fest',
    venue: 'College Main Open Air Auditorium',
    date: getFutureDate(18),
    time: '04:00 PM - 10:00 PM',
    registrationDeadline: getFutureDate(15),
    capacity: 800,
    registeredCount: 530,
    bannerImage:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    clubName: 'Sahrdaya Arts Council',
    ticketType: 'free',
    price: 0,
    tags: ['cultural', 'music', 'dance', 'sargam', 'celebrity-night'],
    contactEmail: 'events@sahrdaya.ac.in',
    contactPhone: '+91 94471 22334',
    status: 'upcoming',
  },
  {
    title: 'National Seminar: Brain-Computer Interfaces & Neural Prosthetics',
    description:
      'Distinguished guest lecture and technical symposium organized by the Department of Biomedical Engineering. Keynote address by Dr. K. Radhakrishnan, leading neural engineering researcher. Includes scientific poster presentation sessions.',
    category: 'National Seminar',
    venue: 'BME Seminar Hall, Biotech Block',
    date: getFutureDate(9),
    time: '10:00 AM - 01:30 PM',
    registrationDeadline: getFutureDate(6),
    capacity: 90,
    registeredCount: 74,
    bannerImage:
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80',
    clubName: 'Department of Biomedical Engineering',
    ticketType: 'free',
    price: 0,
    tags: ['bme', 'neuroscience', 'prosthetics', 'seminar', 'biotech'],
    contactEmail: 'bme.dept@sahrdaya.ac.in',
    contactPhone: '+91 94002 44556',
    status: 'upcoming',
  },
  {
    title: 'IEDC Startup Bootcamp: Validating Ideas & Seed Funding',
    description:
      'Turn your final-year engineering project into a viable market startup! Learn how to navigate Kerala Startup Mission (KSUM) grant applications, patent protection, customer discovery, and angel investor pitching.',
    category: 'Career & Placement',
    venue: 'Decennial Hall (Level 2)',
    date: getFutureDate(7),
    time: '02:00 PM - 05:00 PM',
    registrationDeadline: getFutureDate(4),
    capacity: 100,
    registeredCount: 65,
    bannerImage:
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
    clubName: 'Innovation & Entrepreneurship Development Centre (IEDC)',
    ticketType: 'free',
    price: 0,
    tags: ['startup', 'entrepreneurship', 'ksum', 'funding', 'iedc'],
    contactEmail: 'iedc@sahrdaya.ac.in',
    contactPhone: '+91 98950 33445',
    status: 'upcoming',
  },
  {
    title: 'All-Kerala Inter-Collegiate 3x3 Basketball Championship',
    description:
      'High-octane tournament featuring the top collegiate basketball teams from KTU affiliated engineering colleges. Trophies, medals, and certificates for all finalists. Come cheer for Sahrdaya Titans!',
    category: 'Sports Tournament',
    venue: 'Indoor Sports Complex & Gymnasium',
    date: getFutureDate(14),
    time: '08:30 AM - 06:00 PM',
    registrationDeadline: getFutureDate(10),
    capacity: 250,
    registeredCount: 180,
    bannerImage:
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
    clubName: 'Sahrdaya Physical Education Department',
    ticketType: 'free',
    price: 0,
    tags: ['sports', 'basketball', 'tournament', 'fitness', 'ktu'],
    contactEmail: 'sports@sahrdaya.ac.in',
    contactPhone: '+91 94471 22334',
    status: 'upcoming',
  },
];

module.exports = { users, events };
