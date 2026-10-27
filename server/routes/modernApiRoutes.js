const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const Movie = require('../models/movieModel');
const Theatre = require('../models/theatreModel');
const Show = require('../models/showModel');
const Booking = require('../models/bookingModel');

const JWT_SECRET = process.env.JWT_SECRET || 'IMOVIES_SECRET_KEY';

// Demo Cinema Seed Data
const SEED_MOVIES = [
  {
    id: 'mov-1',
    title: 'Shadow Protocol: Nexus',
    tagline: 'Trust no frequency. Defend the core.',
    description: 'In a neon-drenched metropolis on the brink of digital annihilation, elite operative Kaelen Voss uncovers an autonomous black-ops AI executing high-profile targets across global communications hubs. Together with a renegade data archivist, he races against time to sever the neural link before the entire planetary grid goes dark.',
    duration: 154,
    genre: ['Action', 'Thriller', 'Sci-Fi'],
    language: 'English',
    releaseDate: '2026-03-14',
    rating: 9.2,
    censorRating: 'PG-13',
    posterUrl: '/assets/images/poster_shadow_protocol_1793005407803.jpg',
    bannerUrl: '/assets/images/hero_cinema_hall_1793005405988.jpg',
    director: 'Denis Villeneuve',
    cast: ['Cillian Murphy', 'Florence Pugh', 'Oscar Isaac', 'Rebecca Ferguson'],
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    formats: ['IMAX 3D', '4DX', '2D'],
    isNowShowing: true,
    isUpcoming: false,
    featured: true,
  },
  {
    id: 'mov-2',
    title: 'Chronos: The Forgotten Realm',
    tagline: 'Time is not a line. It is an ocean.',
    description: 'When astrophysicist Dr. Elena Ward activates an ancient gravitational relic hidden beneath the Antarctic ice sheet, she fractures the flow of time itself. Stranded across three simultaneous eras, her crew must reconstruct the broken temporal bridge while evading entities born from unwritten centuries.',
    duration: 168,
    genre: ['Sci-Fi', 'Adventure', 'Mystery'],
    language: 'English',
    releaseDate: '2026-02-28',
    rating: 8.9,
    censorRating: 'PG-13',
    posterUrl: '/assets/images/poster_chronos_realm_1793005408097.jpg',
    bannerUrl: '/assets/images/hero_cinema_hall_1793005405988.jpg',
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Jessica Chastain', 'Timothée Chalamet', 'Michael Caine'],
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    formats: ['IMAX 3D', '3D', '2D'],
    isNowShowing: true,
    isUpcoming: false,
    featured: false,
  },
  {
    id: 'mov-3',
    title: 'Whispering Pines',
    tagline: 'Some forests never forget what you buried.',
    description: 'Deep in the Cascade mountain wilderness, park ranger Samuel Finch begins hearing distress transmissions on a frequency decommissioned three decades ago. As an unseasonal blizzard cuts off the access highway, the town discovers why the indigenous elders warned never to sleep after the pines begin to hum.',
    duration: 122,
    genre: ['Mystery', 'Horror', 'Drama'],
    language: 'English',
    releaseDate: '2026-04-10',
    rating: 8.4,
    censorRating: 'R',
    posterUrl: '/assets/images/poster_whispering_pines_1793005408276.jpg',
    bannerUrl: '/assets/images/hero_cinema_hall_1793005405988.jpg',
    director: 'Robert Eggers',
    cast: ['Willem Dafoe', 'Anya Taylor-Joy', 'Bill Skarsgård'],
    trailerUrl: 'https://www.youtube.com/watch?v=4NYmG_6e2aY',
    formats: ['2D', '4DX'],
    isNowShowing: true,
    isUpcoming: false,
    featured: false,
  },
  {
    id: 'mov-4',
    title: 'Dune: Part Two',
    tagline: 'Long live the fighters.',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.',
    duration: 166,
    genre: ['Action', 'Adventure', 'Drama', 'Sci-Fi'],
    language: 'English',
    releaseDate: '2024-03-01',
    rating: 8.8,
    censorRating: 'PG-13',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800',
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600',
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    formats: ['IMAX 3D', '2D'],
    isNowShowing: true,
    isUpcoming: false,
    featured: false,
  },
  {
    id: 'mov-5',
    title: 'Interstellar: 10th Anniversary',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival as a global crop blight threatens civilization with extinction.',
    duration: 169,
    genre: ['Adventure', 'Drama', 'Sci-Fi'],
    language: 'English',
    releaseDate: '2026-11-05',
    rating: 8.7,
    censorRating: 'PG-13',
    posterUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800',
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600',
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    formats: ['IMAX 3D', '70mm'],
    isNowShowing: false,
    isUpcoming: true,
    featured: false,
  },
];

const SEED_THEATRES = [
  {
    id: 'th-1',
    name: 'IMovies Grand Multiplex',
    city: 'New York',
    location: 'Times Square, 42nd St',
    address: '234 W 42nd St, New York, NY 10036',
    totalScreens: 5,
    screens: [
      { screenNumber: 1, name: 'IMAX Laser Auditorium', seatingCapacity: 120, type: 'IMAX Laser 4K' },
      { screenNumber: 2, name: 'Dolby Cinema Lounge', seatingCapacity: 96, type: 'Dolby Atmos Premium' },
      { screenNumber: 3, name: 'Screen 3 Premier', seatingCapacity: 80, type: 'Standard Digital' },
    ],
  },
  {
    id: 'th-2',
    name: 'IMovies Royale Luxe',
    city: 'Los Angeles',
    location: 'Sunset Blvd, Hollywood',
    address: '6801 Hollywood Blvd, Los Angeles, CA 90028',
    totalScreens: 4,
    screens: [
      { screenNumber: 1, name: 'Dolby Atmos Grand', seatingCapacity: 110, type: 'Dolby Cinema™ 64Ch' },
      { screenNumber: 2, name: 'VIP Recliner Suite', seatingCapacity: 64, type: 'Luxury Recliners' },
    ],
  },
  {
    id: 'th-3',
    name: 'IMovies Apex CineDome',
    city: 'Chicago',
    location: 'Michigan Ave, Downtown',
    address: '700 N Michigan Ave, Chicago, IL 60611',
    totalScreens: 6,
    screens: [
      { screenNumber: 1, name: 'Dome Screen 1', seatingCapacity: 140, type: 'IMAX 3D Laser' },
      { screenNumber: 2, name: '4DX Motion Studio', seatingCapacity: 88, type: '4DX Motion' },
    ],
  },
];

// Helper to generate seat map
function generateSeats() {
  const seats = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  rows.forEach((row, rowIdx) => {
    const isVip = rowIdx < 2;
    const isGold = rowIdx >= 2 && rowIdx < 5;
    const type = isVip ? 'vip' : isGold ? 'gold' : 'silver';
    const price = isVip ? 24 : isGold ? 18 : 14;

    for (let num = 1; num <= 12; num++) {
      const isBooked = (rowIdx === 3 && (num === 4 || num === 5)) || (rowIdx === 1 && num === 7);
      seats.push({
        id: `${row}${num}`,
        row,
        number: num,
        type,
        price,
        status: isBooked ? 'booked' : 'available',
      });
    }
  });
  return seats;
}

let showsList = [];
function getOrInitShows() {
  if (showsList.length > 0) return showsList;
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const shows = [];
  const times = [
    { start: '11:30', end: '14:04' },
    { start: '14:45', end: '17:19' },
    { start: '18:15', end: '20:49' },
    { start: '21:30', end: '00:04' },
  ];

  SEED_MOVIES.filter(m => m.isNowShowing).forEach(movie => {
    SEED_THEATRES.forEach(theatre => {
      [today, tomorrow].forEach(date => {
        times.slice(0, 2).forEach((time, tIdx) => {
          const screen = theatre.screens[tIdx % theatre.screens.length];
          const seats = generateSeats();
          shows.push({
            id: `show-${movie.id}-${theatre.id}-${date}-${time.start.replace(':', '')}`,
            movieId: movie.id,
            theatreId: theatre.id,
            screenNumber: screen.screenNumber,
            screenName: screen.name,
            showDate: date,
            startTime: time.start,
            endTime: time.end,
            format: movie.formats[0] || '2D',
            pricing: { silver: 14, gold: 18, vip: 24 },
            seats,
            availableSeatsCount: seats.filter(s => s.status === 'available').length,
            totalSeats: seats.length,
            movie,
            theatre,
          });
        });
      });
    });
  });
  showsList = shows;
  return showsList;
}

// -------------------------------------------------------------
// Auth Routes for UI_REFF
// -------------------------------------------------------------
router.get('/auth/demo-accounts', (req, res) => {
  res.json({
    admin: { email: 'admin@imovies.com', password: 'password', pin: '9922' },
    user: { email: 'sarah@cinema.com', password: 'password' },
  });
});

router.post('/auth/admin-login', async (req, res) => {
  const { email, password, pin } = req.body;
  if (pin && pin !== '9922') {
    return res.status(401).json({ error: 'Invalid Security PIN. Authorization denied.' });
  }

  const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
  res.json({
    user: {
      id: 'adm-001',
      name: 'Operations Administrator',
      email: email || 'admin@imovies.com',
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
    token,
  });
});

router.get('/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      user: {
        id: decoded.id || 'usr-sarah-1',
        name: decoded.name || 'Sarah Jenkins',
        email: decoded.email,
        role: decoded.role || 'user',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    res.status(401).json({ error: 'Session expired' });
  }
});

// -------------------------------------------------------------
// Movies Routes for UI_REFF
// -------------------------------------------------------------
let moviesList = [...SEED_MOVIES];

router.get('/movies', (req, res) => {
  const { search, genre, format, status } = req.query;
  let result = [...moviesList];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(m => m.title.toLowerCase().includes(q) || m.genre.some(g => g.toLowerCase().includes(q)));
  }
  if (genre && genre !== 'All') {
    result = result.filter(m => m.genre.includes(genre));
  }
  if (format && format !== 'All') {
    result = result.filter(m => m.formats.includes(format));
  }
  if (status === 'now-showing') {
    result = result.filter(m => m.isNowShowing);
  } else if (status === 'upcoming') {
    result = result.filter(m => m.isUpcoming);
  }

  res.json({ count: result.length, movies: result });
});

router.get('/movies/:id', (req, res) => {
  const movie = moviesList.find(m => m.id === req.params.id) || moviesList[0];
  const allShows = getOrInitShows();
  const shows = allShows.filter(s => s.movieId === movie.id);
  res.json({ movie, shows });
});

router.post('/movies', (req, res) => {
  const newMovie = {
    id: 'mov-' + Date.now(),
    title: req.body.title || 'Untitled',
    tagline: req.body.tagline || '',
    description: req.body.description || '',
    duration: Number(req.body.duration) || 120,
    genre: req.body.genre || ['Drama'],
    language: req.body.language || 'English',
    releaseDate: req.body.releaseDate || new Date().toISOString().split('T')[0],
    rating: Number(req.body.rating) || 8.0,
    censorRating: req.body.censorRating || 'PG-13',
    posterUrl: req.body.posterUrl || '/assets/images/poster_shadow_protocol_1793005407803.jpg',
    bannerUrl: req.body.bannerUrl || '/assets/images/hero_cinema_hall_1793005405988.jpg',
    director: req.body.director || 'Director',
    cast: req.body.cast || [],
    trailerUrl: req.body.trailerUrl,
    formats: req.body.formats || ['2D', 'IMAX 3D'],
    isNowShowing: req.body.isNowShowing ?? true,
    isUpcoming: req.body.isUpcoming ?? false,
  };
  moviesList.unshift(newMovie);
  res.status(201).json({ movie: newMovie });
});

router.put('/movies/:id', (req, res) => {
  const idx = moviesList.findIndex(m => m.id === req.params.id);
  if (idx !== -1) {
    moviesList[idx] = { ...moviesList[idx], ...req.body };
    return res.json({ movie: moviesList[idx] });
  }
  res.status(404).json({ error: 'Movie not found' });
});

router.delete('/movies/:id', (req, res) => {
  moviesList = moviesList.filter(m => m.id !== req.params.id);
  res.json({ message: 'Movie deleted' });
});

// -------------------------------------------------------------
// Theatres Routes for UI_REFF
// -------------------------------------------------------------
let theatresList = [...SEED_THEATRES];

router.get('/theatres', (req, res) => {
  const { city } = req.query;
  const cities = Array.from(new Set(theatresList.map(t => t.city)));
  let result = [...theatresList];
  if (city && city !== 'All') {
    result = result.filter(t => t.city.toLowerCase() === city.toLowerCase());
  }
  res.json({ cities, theatres: result });
});

router.post('/theatres', (req, res) => {
  const newTheatre = {
    id: 'th-' + Date.now(),
    name: req.body.name || 'New Multiplex',
    city: req.body.city || 'New York',
    location: req.body.location || '',
    address: req.body.address || '',
    totalScreens: req.body.totalScreens || 3,
    screens: req.body.screens || [
      { screenNumber: 1, name: 'Grand Screen', seatingCapacity: 100, type: 'IMAX Laser 4K' },
    ],
  };
  theatresList.push(newTheatre);
  res.status(201).json({ theatre: newTheatre });
});

// -------------------------------------------------------------
// Shows Routes for UI_REFF
// -------------------------------------------------------------
router.get('/shows', (req, res) => {
  const { movieId, theatreId, date, city } = req.query;
  let result = getOrInitShows();

  if (movieId) result = result.filter(s => s.movieId === movieId);
  if (theatreId) result = result.filter(s => s.theatreId === theatreId);
  if (date) result = result.filter(s => s.showDate === date);
  if (city && city !== 'All') {
    result = result.filter(s => s.theatre && s.theatre.city.toLowerCase() === city.toLowerCase());
  }

  res.json({ shows: result });
});

router.get('/shows/:id', (req, res) => {
  const all = getOrInitShows();
  const show = all.find(s => s.id === req.params.id) || all[0];
  res.json({ show });
});

router.post('/shows/:id/lock-seats', (req, res) => {
  const { seatIds } = req.body;
  const count = seatIds ? seatIds.length : 1;
  res.json({
    message: `${count} seat(s) held for 10 minutes.`,
    lockedUntil: Date.now() + 600 * 1000,
    expiresInSeconds: 600,
  });
});

router.post('/shows/:id/unlock-seats', (req, res) => {
  res.json({ message: 'Seats released' });
});

router.post('/shows', (req, res) => {
  const all = getOrInitShows();
  const movie = moviesList.find(m => m.id === req.body.movieId) || moviesList[0];
  const theatre = theatresList.find(t => t.id === req.body.theatreId) || theatresList[0];
  const seats = generateSeats();

  const newShow = {
    id: 'show-' + Date.now(),
    movieId: movie.id,
    theatreId: theatre.id,
    screenNumber: Number(req.body.screenNumber) || 1,
    screenName: req.body.screenName || 'Screen 1',
    showDate: req.body.showDate || new Date().toISOString().split('T')[0],
    startTime: req.body.startTime || '18:00',
    endTime: req.body.endTime || '20:30',
    format: req.body.format || 'IMAX 3D',
    pricing: req.body.pricing || { silver: 14, gold: 18, vip: 24 },
    seats,
    availableSeatsCount: seats.length,
    totalSeats: seats.length,
    movie,
    theatre,
  };

  all.unshift(newShow);
  res.status(201).json({ show: newShow });
});

// -------------------------------------------------------------
// Bookings Routes for UI_REFF
// -------------------------------------------------------------
let bookingsList = [];

router.get('/bookings', (req, res) => {
  res.json({ bookings: bookingsList });
});

router.post('/bookings', (req, res) => {
  const { showId, seatIds, snacks, paymentMethod } = req.body;
  const allShows = getOrInitShows();
  const show = allShows.find(s => s.id === showId) || allShows[0];
  const movie = show.movie || moviesList[0];
  const theatre = show.theatre || theatresList[0];

  const bookedSeats = (seatIds || []).map(id => {
    const row = id[0];
    const num = parseInt(id.slice(1), 10);
    const isVip = ['A', 'B'].includes(row);
    const isGold = ['C', 'D', 'E'].includes(row);
    const type = isVip ? 'vip' : isGold ? 'gold' : 'silver';
    const price = show.pricing?.[type] || (isVip ? 24 : isGold ? 18 : 14);
    return { row, number: num, type, price };
  });

  const subtotal = bookedSeats.reduce((acc, s) => acc + s.price, 0);
  const convenienceFee = bookedSeats.length * 2.5;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const snacksTotal = (snacks || []).reduce((acc, s) => acc + (s.price * s.quantity), 0);
  const totalAmount = Number((subtotal + convenienceFee + tax + snacksTotal).toFixed(2));

  const ref = 'IMV-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const newBooking = {
    id: 'bk-' + Date.now(),
    bookingReference: ref,
    userId: 'usr-sarah-1',
    userName: 'Sarah Jenkins',
    userEmail: 'sarah@cinema.com',
    showId: show.id,
    movie: {
      id: movie.id,
      title: movie.title,
      posterUrl: movie.posterUrl,
      duration: movie.duration,
      format: show.format,
    },
    theatre: {
      id: theatre.id,
      name: theatre.name,
      city: theatre.city,
      screenName: show.screenName,
      screenNumber: show.screenNumber,
    },
    showDate: show.showDate,
    startTime: show.startTime,
    seats: bookedSeats,
    snacks: snacks || [],
    ticketSubtotal: subtotal,
    convenienceFee,
    tax,
    totalAmount,
    paymentId: 'PAY-' + Date.now(),
    paymentMethod: paymentMethod || 'Credit Card (Apple Pay)',
    bookingStatus: 'confirmed',
    qrCodeData: `IMOVIES-VERIFIED-${ref}-${show.id}`,
    bookedAt: new Date().toISOString(),
  };

  bookingsList.unshift(newBooking);
  res.status(201).json({ message: 'Booking confirmed!', booking: newBooking });
});

router.post('/bookings/:id/cancel', (req, res) => {
  const booking = bookingsList.find(b => b.id === req.params.id);
  if (booking) {
    booking.bookingStatus = 'cancelled';
    booking.refundAmount = booking.totalAmount;
    return res.json({ message: 'Booking cancelled and refund issued.', booking });
  }
  res.status(404).json({ error: 'Booking not found' });
});

router.get('/bookings/admin/all', (req, res) => {
  res.json({ bookings: bookingsList });
});

router.get('/bookings/admin/stats', (req, res) => {
  const confirmed = bookingsList.filter(b => b.bookingStatus === 'confirmed');
  const totalRev = confirmed.reduce((acc, b) => acc + b.totalAmount, 0) + 18450;
  res.json({
    stats: {
      totalRevenue: totalRev,
      totalBookings: confirmed.length + 328,
      activeShows: getOrInitShows().length,
      occupancyRate: 82.4,
      recentBookings: bookingsList.slice(0, 5),
      revenueByDay: [
        { day: 'Mon', revenue: 2400 },
        { day: 'Tue', revenue: 3100 },
        { day: 'Wed', revenue: 2850 },
        { day: 'Thu', revenue: 4200 },
        { day: 'Fri', revenue: 7800 },
        { day: 'Sat', revenue: 9400 },
        { day: 'Sun', revenue: 8600 },
      ],
    },
  });
});

// -------------------------------------------------------------
// Notifications
// -------------------------------------------------------------
router.get('/notifications', (req, res) => {
  res.json({
    notifications: [
      {
        id: 'notif-1',
        title: 'Booking Confirmed!',
        message: 'Your ticket pass for Shadow Protocol: Nexus is ready.',
        type: 'booking',
        read: false,
        createdAt: '10m ago',
      },
      {
        id: 'notif-2',
        title: 'Real-Time Seat Locking Active',
        message: 'Seats are dynamically held with a 10-minute checkout timer.',
        type: 'system',
        read: true,
        createdAt: '2h ago',
      },
      {
        id: 'notif-3',
        title: 'New IMAX Releases',
        message: 'Advance bookings are now open for Chronos: The Forgotten Realm.',
        type: 'system',
        read: true,
        createdAt: '1d ago',
      },
    ],
    unreadCount: 1,
  });
});

module.exports = router;
