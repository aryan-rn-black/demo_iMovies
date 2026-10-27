import {
  User,
  Movie,
  Theatre,
  Show,
  Booking,
  Notification,
  AdminStats,
  Seat,
  MovieFormat,
} from '../types/index.js';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '') + '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('imovies_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// -------------------------------------------------------------
// Fallback Cinema Dataset (Mirrors https://aryan-rn-black.github.io/iMovies/)
// -------------------------------------------------------------
const INITIAL_THEATRES: Theatre[] = [
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

const INITIAL_MOVIES: Movie[] = [
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

// Helper to generate realistic cinema seating layout
function generateShowSeats(): Seat[] {
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  rows.forEach((row, rowIdx) => {
    const isVip = rowIdx < 2; // Rows A, B
    const isGold = rowIdx >= 2 && rowIdx < 5; // Rows C, D, E
    const seatType = isVip ? 'vip' : isGold ? 'gold' : 'silver';
    const price = isVip ? 24 : isGold ? 18 : 14;

    for (let num = 1; num <= 12; num++) {
      // Create occasional booked seats for realism
      const isBooked = (rowIdx === 3 && (num === 4 || num === 5 || num === 6)) ||
                       (rowIdx === 1 && (num === 7 || num === 8)) ||
                       (rowIdx === 6 && (num === 2 || num === 3));

      seats.push({
        id: `${row}${num}`,
        row,
        number: num,
        type: seatType,
        price,
        status: isBooked ? 'booked' : 'available',
      });
    }
  });
  return seats;
}

// Generate default shows matching movies and theatres
function generateDefaultShows(): Show[] {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const shows: Show[] = [];
  const times = [
    { start: '11:30', end: '14:04' },
    { start: '14:45', end: '17:19' },
    { start: '18:15', end: '20:49' },
    { start: '21:30', end: '00:04' },
  ];

  INITIAL_MOVIES.filter(m => m.isNowShowing).forEach(movie => {
    INITIAL_THEATRES.forEach(theatre => {
      [today, tomorrow].forEach(date => {
        times.slice(0, 2).forEach((time, tIdx) => {
          const screen = theatre.screens[tIdx % theatre.screens.length];
          const format = movie.formats[0] || '2D';
          const seats = generateShowSeats();
          const availableCount = seats.filter(s => s.status === 'available').length;

          shows.push({
            id: `show-${movie.id}-${theatre.id}-${date}-${time.start.replace(':', '')}`,
            movieId: movie.id,
            theatreId: theatre.id,
            screenNumber: screen.screenNumber,
            screenName: screen.name,
            showDate: date,
            startTime: time.start,
            endTime: time.end,
            format,
            pricing: { silver: 14, gold: 18, vip: 24 },
            seats,
            availableSeatsCount: availableCount,
            totalSeats: seats.length,
            movie,
            theatre,
          });
        });
      });
    });
  });

  return shows;
}

// LocalStorage Persistence helpers
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}

// Initialize mock database in localStorage if not already set
let localMovies = getStored<Movie[]>('imovies_db_movies', INITIAL_MOVIES);
let localTheatres = getStored<Theatre[]>('imovies_db_theatres', INITIAL_THEATRES);
let localShows = getStored<Show[]>('imovies_db_shows', generateDefaultShows());
let localBookings = getStored<Booking[]>('imovies_db_bookings', []);

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch {
      // Fallback
    }

    // Default Demo Auth Fallback
    const isMockAdmin = email.toLowerCase().includes('admin');
    const user: User = {
      id: isMockAdmin ? 'usr-admin-1' : 'usr-sarah-1',
      name: isMockAdmin ? 'System Administrator' : 'Sarah Jenkins',
      email,
      role: isMockAdmin ? 'admin' : 'user',
      phone: '+1 (555) 392-8192',
      createdAt: new Date().toISOString(),
    };
    const token = 'mock_jwt_token_' + Date.now();
    localStorage.setItem('imovies_token', token);
    localStorage.setItem('imovies_user', JSON.stringify(user));
    return { user, token };
  },

  async adminLogin(email: string, password: string, pin?: string): Promise<{ user: User; token: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, pin }),
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch {
      // Fallback
    }

    if (pin && pin !== '9922') {
      throw new Error('Invalid Security PIN. Access denied.');
    }

    const user: User = {
      id: 'usr-admin-1',
      name: 'Operations Administrator',
      email: email || 'admin@imovies.com',
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    const token = 'mock_admin_jwt_' + Date.now();
    localStorage.setItem('imovies_token', token);
    localStorage.setItem('imovies_user', JSON.stringify(user));
    return { user, token };
  },

  async register(payload: { name: string; email: string; password: string; phone?: string; role?: string }): Promise<{ user: User; token: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const user: User = {
      id: 'usr-' + Date.now(),
      name: payload.name,
      email: payload.email,
      role: (payload.role as any) || 'user',
      phone: payload.phone,
      createdAt: new Date().toISOString(),
    };
    const token = 'mock_jwt_token_' + Date.now();
    localStorage.setItem('imovies_token', token);
    localStorage.setItem('imovies_user', JSON.stringify(user));
    return { user, token };
  },

  async getMe(): Promise<{ user: User }> {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const storedUser = localStorage.getItem('imovies_user');
    if (storedUser) {
      return { user: JSON.parse(storedUser) };
    }
    throw new Error('Not authenticated.');
  },

  async getDemoAccounts(): Promise<{ admin: any; user: any }> {
    try {
      const res = await fetch(`${API_BASE}/auth/demo-accounts`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return {
      admin: { email: 'admin@imovies.com', password: 'password', pin: '9922' },
      user: { email: 'sarah@cinema.com', password: 'password' },
    };
  },

  // Movies
  async getMovies(params?: { search?: string; genre?: string; language?: string; format?: string; status?: string }): Promise<{ count: number; movies: Movie[] }> {
    try {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.genre) query.append('genre', params.genre);
      if (params?.language) query.append('language', params.language);
      if (params?.format) query.append('format', params.format);
      if (params?.status) query.append('status', params.status);

      const res = await fetch(`${API_BASE}/movies?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.movies && data.movies.length > 0) return data;
      }
    } catch {
      // Fallback
    }

    let filtered = [...localMovies];
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(m => m.title.toLowerCase().includes(q) || m.genre.some(g => g.toLowerCase().includes(q)));
    }
    if (params?.genre && params.genre !== 'All') {
      filtered = filtered.filter(m => m.genre.includes(params.genre!));
    }
    if (params?.status === 'now-showing') {
      filtered = filtered.filter(m => m.isNowShowing);
    } else if (params?.status === 'upcoming') {
      filtered = filtered.filter(m => m.isUpcoming);
    }
    if (params?.format && params.format !== 'All') {
      filtered = filtered.filter(m => m.formats.includes(params.format as MovieFormat));
    }

    return { count: filtered.length, movies: filtered };
  },

  async getMovieById(id: string): Promise<{ movie: Movie; shows: Show[] }> {
    try {
      const res = await fetch(`${API_BASE}/movies/${id}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const movie = localMovies.find(m => m.id === id) || localMovies[0];
    const shows = localShows.filter(s => s.movieId === movie.id);
    return { movie, shows };
  },

  async createMovie(movieData: Partial<Movie>): Promise<{ movie: Movie }> {
    const newMovie: Movie = {
      id: 'mov-' + Date.now(),
      title: movieData.title || 'Untitled Film',
      tagline: movieData.tagline || '',
      description: movieData.description || '',
      duration: Number(movieData.duration) || 120,
      genre: movieData.genre || ['Drama'],
      language: movieData.language || 'English',
      releaseDate: movieData.releaseDate || new Date().toISOString().split('T')[0],
      rating: Number(movieData.rating) || 8.0,
      censorRating: movieData.censorRating || 'PG-13',
      posterUrl: movieData.posterUrl || '/assets/images/poster_shadow_protocol_1793005407803.jpg',
      bannerUrl: movieData.bannerUrl || '/assets/images/hero_cinema_hall_1793005405988.jpg',
      director: movieData.director || 'Director',
      cast: movieData.cast || [],
      trailerUrl: movieData.trailerUrl,
      formats: movieData.formats || ['2D', 'IMAX 3D'],
      isNowShowing: movieData.isNowShowing ?? true,
      isUpcoming: movieData.isUpcoming ?? false,
    };

    localMovies = [newMovie, ...localMovies];
    setStored('imovies_db_movies', localMovies);

    try {
      await fetch(`${API_BASE}/movies`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newMovie),
      });
    } catch {
      // Ignore
    }

    return { movie: newMovie };
  },

  async updateMovie(id: string, movieData: Partial<Movie>): Promise<{ movie: Movie }> {
    localMovies = localMovies.map(m => (m.id === id ? { ...m, ...movieData } : m));
    setStored('imovies_db_movies', localMovies);
    const updated = localMovies.find(m => m.id === id)!;
    return { movie: updated };
  },

  async deleteMovie(id: string): Promise<void> {
    localMovies = localMovies.filter(m => m.id !== id);
    setStored('imovies_db_movies', localMovies);
  },

  // Theatres
  async getTheatres(city?: string): Promise<{ cities: string[]; theatres: Theatre[] }> {
    try {
      const query = city ? `?city=${encodeURIComponent(city)}` : '';
      const res = await fetch(`${API_BASE}/theatres${query}`);
      if (res.ok) {
        const data = await res.json();
        if (data.theatres && data.theatres.length > 0) return data;
      }
    } catch {
      // Fallback
    }

    const cities = Array.from(new Set(localTheatres.map(t => t.city)));
    let theatres = [...localTheatres];
    if (city && city !== 'All') {
      theatres = theatres.filter(t => t.city.toLowerCase() === city.toLowerCase());
    }
    return { cities, theatres };
  },

  async createTheatre(theatreData: Partial<Theatre>): Promise<{ theatre: Theatre }> {
    const newTheatre: Theatre = {
      id: 'th-' + Date.now(),
      name: theatreData.name || 'New Multiplex',
      city: theatreData.city || 'New York',
      location: theatreData.location || '',
      address: theatreData.address || '',
      totalScreens: theatreData.totalScreens || 4,
      screens: theatreData.screens || [
        { screenNumber: 1, name: 'Main Auditorium', seatingCapacity: 100, type: 'IMAX 3D' },
      ],
    };
    localTheatres = [...localTheatres, newTheatre];
    setStored('imovies_db_theatres', localTheatres);
    return { theatre: newTheatre };
  },

  // Shows
  async getShows(params?: { movieId?: string; theatreId?: string; date?: string; city?: string }): Promise<{ shows: Show[] }> {
    try {
      const query = new URLSearchParams();
      if (params?.movieId) query.append('movieId', params.movieId);
      if (params?.theatreId) query.append('theatreId', params.theatreId);
      if (params?.date) query.append('date', params.date);
      if (params?.city) query.append('city', params.city);

      const res = await fetch(`${API_BASE}/shows?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.shows && data.shows.length > 0) return data;
      }
    } catch {
      // Fallback
    }

    let filtered = [...localShows];
    if (params?.movieId) filtered = filtered.filter(s => s.movieId === params.movieId);
    if (params?.theatreId) filtered = filtered.filter(s => s.theatreId === params.theatreId);
    if (params?.date) filtered = filtered.filter(s => s.showDate === params.date);
    if (params?.city && params.city !== 'All') {
      filtered = filtered.filter(s => s.theatre?.city.toLowerCase() === params.city?.toLowerCase());
    }
    return { shows: filtered };
  },

  async getShowById(id: string): Promise<{ show: Show }> {
    try {
      const res = await fetch(`${API_BASE}/shows/${id}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    let show = localShows.find(s => s.id === id);
    if (!show) {
      show = generateDefaultShows()[0];
    }
    return { show };
  },

  async lockSeats(showId: string, seatIds: string[]): Promise<{ message: string; lockedUntil: number; expiresInSeconds: number }> {
    const expires = Date.now() + 600 * 1000;
    return {
      message: `${seatIds.length} seat(s) held for 10 minutes.`,
      lockedUntil: expires,
      expiresInSeconds: 600,
    };
  },

  async unlockSeats(showId: string, seatIds?: string[]): Promise<void> {
    // No-op for mock
  },

  async createShow(showData: any): Promise<{ show: Show }> {
    const movie = localMovies.find(m => m.id === showData.movieId) || localMovies[0];
    const theatre = localTheatres.find(t => t.id === showData.theatreId) || localTheatres[0];
    const seats = generateShowSeats();

    const newShow: Show = {
      id: 'show-' + Date.now(),
      movieId: movie.id,
      theatreId: theatre.id,
      screenNumber: Number(showData.screenNumber) || 1,
      screenName: showData.screenName || 'Hall 1',
      showDate: showData.showDate || new Date().toISOString().split('T')[0],
      startTime: showData.startTime || '18:00',
      endTime: showData.endTime || '20:30',
      format: (showData.format as MovieFormat) || 'IMAX 3D',
      pricing: showData.pricing || { silver: 14, gold: 18, vip: 24 },
      seats,
      availableSeatsCount: seats.length,
      totalSeats: seats.length,
      movie,
      theatre,
    };

    localShows = [newShow, ...localShows];
    setStored('imovies_db_shows', localShows);
    return { show: newShow };
  },

  async deleteShow(id: string): Promise<void> {
    localShows = localShows.filter(s => s.id !== id);
    setStored('imovies_db_shows', localShows);
  },

  // Bookings
  async getMyBookings(): Promise<{ bookings: Booking[] }> {
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.bookings && data.bookings.length > 0) return data;
      }
    } catch {
      // Fallback
    }

    return { bookings: localBookings };
  },

  async getBookingById(id: string): Promise<{ booking: Booking }> {
    const booking = localBookings.find(b => b.id === id);
    if (!booking) throw new Error('Booking not found');
    return { booking };
  },

  async createBooking(payload: {
    showId: string;
    seatIds: string[];
    snacks?: any[];
    paymentMethod?: string;
  }): Promise<{ message: string; booking: Booking }> {
    const show = localShows.find(s => s.id === payload.showId) || generateDefaultShows()[0];
    const movie = show.movie || localMovies[0];
    const theatre = show.theatre || localTheatres[0];

    // Calculate seats
    const bookedSeats = payload.seatIds.map(id => {
      const row = id[0];
      const num = parseInt(id.slice(1), 10);
      const isVip = ['A', 'B'].includes(row);
      const isGold = ['C', 'D', 'E'].includes(row);
      const type = isVip ? 'vip' : isGold ? 'gold' : 'silver';
      const price = show.pricing?.[type] || (isVip ? 24 : isGold ? 18 : 14);
      return { row, number: num, type: type as any, price };
    });

    const subtotal = bookedSeats.reduce((acc, s) => acc + s.price, 0);
    const convenienceFee = bookedSeats.length * 2.5;
    const tax = Number((subtotal * 0.08).toFixed(2));
    const snacksTotal = (payload.snacks || []).reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    const totalAmount = Number((subtotal + convenienceFee + tax + snacksTotal).toFixed(2));

    const ref = 'IMV-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const newBooking: Booking = {
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
      snacks: payload.snacks || [],
      ticketSubtotal: subtotal,
      convenienceFee,
      tax,
      totalAmount,
      paymentId: 'PAY-' + Date.now(),
      paymentMethod: payload.paymentMethod || 'Credit Card (Apple Pay)',
      bookingStatus: 'confirmed',
      qrCodeData: `IMOVIES-VERIFIED-${ref}-${show.id}`,
      bookedAt: new Date().toISOString(),
    };

    localBookings = [newBooking, ...localBookings];
    setStored('imovies_db_bookings', localBookings);

    // Mark seats as booked in show
    localShows = localShows.map(s => {
      if (s.id === show.id) {
        const updatedSeats = s.seats.map(st => {
          if (payload.seatIds.includes(st.id)) {
            return { ...st, status: 'booked' as const };
          }
          return st;
        });
        return {
          ...s,
          seats: updatedSeats,
          availableSeatsCount: updatedSeats.filter(st => st.status === 'available').length,
        };
      }
      return s;
    });
    setStored('imovies_db_shows', localShows);

    return { message: 'Booking confirmed successfully!', booking: newBooking };
  },

  async cancelBooking(id: string): Promise<{ message: string; booking: Booking }> {
    localBookings = localBookings.map(b => (b.id === id ? { ...b, bookingStatus: 'cancelled' as const, refundAmount: b.totalAmount } : b));
    setStored('imovies_db_bookings', localBookings);
    const updated = localBookings.find(b => b.id === id)!;
    return { message: 'Booking cancelled and refund processed.', booking: updated };
  },

  async getAllBookings(): Promise<{ bookings: Booking[] }> {
    return { bookings: localBookings };
  },

  async getAdminStats(): Promise<{ stats: AdminStats }> {
    const totalRev = localBookings
      .filter(b => b.bookingStatus === 'confirmed')
      .reduce((acc, b) => acc + b.totalAmount, 0) + 18450;

    return {
      stats: {
        totalRevenue: totalRev,
        totalBookings: localBookings.length + 328,
        activeShows: localShows.length,
        occupancyRate: 82.4,
        recentBookings: localBookings.slice(0, 5),
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
    };
  },

  // Notifications
  async getNotifications(): Promise<{ notifications: Notification[]; unreadCount: number }> {
    const notifications: Notification[] = [
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
    ];
    return { notifications, unreadCount: 1 };
  },

  async markNotificationRead(id: string): Promise<void> {},
  async markAllNotificationsRead(): Promise<void> {},
};
