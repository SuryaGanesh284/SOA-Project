export let catalog = [
  {
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    year: 2013,
    rating: 5,
    swatch: 'from-sky-500 to-blue-900',
    groups: ['physical', 'reading-now', 'quiet'],
    description: 'How everyday objects communicate, and why good design makes them easier to use.',
    copies: [
      { code: 'PHY-014', status: 'BORROWED', location: 'On loan' },
      { code: 'PHY-015', status: 'AVAILABLE', location: 'Shelf A3' },
    ],
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    year: 2008,
    rating: 4,
    swatch: 'from-indigo-500 to-slate-900',
    groups: ['ebooks', 'saved', 'research'],
    description: 'A handbook of agile software craftsmanship for writing code that stays readable.',
    copies: [{ code: 'DIG-102', status: 'AVAILABLE', location: 'Online' }],
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'David Thomas',
    year: 2019,
    rating: 5,
    swatch: 'from-emerald-500 to-teal-900',
    groups: ['ebooks', 'saved'],
    description: 'Practical habits for building software that is easier to change and maintain.',
    copies: [{ code: 'DIG-118', status: 'AVAILABLE', location: 'Online' }],
  },
  {
    title: 'Algorithms to Live By',
    author: 'Brian Christian',
    year: 2016,
    rating: 4,
    swatch: 'from-amber-500 to-orange-900',
    groups: ['audio', 'due-soon'],
    description: 'Computer science ideas applied to everyday decisions, from sorting to stopping.',
    copies: [{ code: 'AUD-021', status: 'AVAILABLE', location: 'Online' }],
  },
  {
    title: 'Structure and Interpretation',
    author: 'Harold Abelson',
    year: 1996,
    rating: 5,
    swatch: 'from-rose-500 to-red-950',
    groups: ['papers', 'research'],
    description: 'A classic introduction to programming through abstraction and recursion.',
    copies: [{ code: 'PAP-044', status: 'AVAILABLE', location: 'Online' }],
  },
  {
    title: 'Deep Work',
    author: 'Cal Newport',
    year: 2016,
    rating: 5,
    swatch: 'from-sky-400 to-blue-800',
    groups: ['ebooks', 'reading-now', 'quiet'],
    description: 'Rules for focused success in a distracted world.',
    copies: [{ code: 'DIG-130', status: 'AVAILABLE', location: 'Online' }],
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    year: 2018,
    rating: 4,
    swatch: 'from-amber-300 to-orange-700',
    groups: ['audio', 'saved', 'quiet'],
    description: 'A practical guide to building better habits through small changes.',
    copies: [{ code: 'AUD-033', status: 'AVAILABLE', location: 'Online' }],
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    year: 2011,
    rating: 5,
    swatch: 'from-slate-400 to-slate-800',
    groups: ['papers', 'due-soon', 'history'],
    description: 'How two modes of thought shape judgment and decision making.',
    copies: [{ code: 'PAP-051', status: 'AVAILABLE', location: 'Online' }],
  },
  {
    title: 'The Art of Computer Programming',
    author: 'Donald Knuth',
    year: 1968,
    rating: 5,
    swatch: 'from-rose-400 to-red-900',
    groups: ['physical', 'classics'],
    description: 'A foundational reference on algorithms and their analysis.',
    copies: [
      { code: 'PHY-201', status: 'AVAILABLE', location: 'Shelf C1' },
      { code: 'PHY-202', status: 'MAINTENANCE', location: 'Repair' },
    ],
  },
  {
    title: 'Gödel, Escher, Bach',
    author: 'Douglas Hofstadter',
    year: 1979,
    rating: 4,
    swatch: 'from-emerald-400 to-teal-800',
    groups: ['videos', 'classics'],
    description: 'An exploration of patterns, meaning, and self-reference.',
    copies: [{ code: 'VID-008', status: 'AVAILABLE', location: 'Online' }],
  },
]

const formatLabels = {
  ebooks: 'E-book',
  papers: 'Research paper',
  videos: 'Video',
  audio: 'Audio book',
  physical: 'Physical book',
}

export function formatOf(book) {
  const group = book.groups.find((item) => formatLabels[item])
  return formatLabels[group]
}

export function bookByTitle(title) {
  return catalog.find((book) => book.title === title)
}

export const sectionLabels = {
  ebooks: 'E-books',
  papers: 'Papers',
  videos: 'Videos',
  audio: 'Audio',
  physical: 'Physical',
  'due-soon': 'Due soon',
  'reading-now': 'Reading now',
  saved: 'Saved',
  history: 'History of Science',
  quiet: 'Quiet reading',
  research: 'Research papers',
  classics: 'Classic fiction',
}

export function booksFor(sectionId) {
  return catalog.filter((book) => book.groups.includes(sectionId))
}

export function searchCatalog(query) {
  const term = query.trim().toLowerCase()
  if (!term) return []
  return catalog.filter((book) => {
    return book.title.toLowerCase().includes(term) || book.author.toLowerCase().includes(term)
  })
}

const CATALOG_KEY = 'archivalia-catalog'
const formats = ['ebooks', 'papers', 'videos', 'audio', 'physical']

export function loadCatalog() {
  const saved = localStorage.getItem(CATALOG_KEY)
  if (saved) catalog = JSON.parse(saved)
  return catalog
}

export function saveCatalog(next) {
  catalog = next
  localStorage.setItem(CATALOG_KEY, JSON.stringify(next))
  return catalog
}

export function upsertResource(books, draft) {
  const title = draft.title.trim()
  const author = draft.author.trim()
  const year = Number(draft.year)
  if (!title || !author || !year) return { error: 'Enter a title, author, and year.' }
  const duplicate = books.some((book) => book.title === title && book.title !== draft.originalTitle)
  if (duplicate) return { error: 'A resource with that title already exists.' }

  if (draft.originalTitle) {
    const next = books.map((book) => {
      if (book.title !== draft.originalTitle) return book
      const rest = book.groups.filter((group) => !formats.includes(group))
      return { ...book, title, author, year, description: draft.description.trim(), groups: [draft.format, ...rest] }
    })
    return { books: next }
  }

  const code = `${draft.format === 'physical' ? 'PHY' : 'DIG'}-${String(Date.now()).slice(-3)}`
  const next = [
    ...books,
    {
      title,
      author,
      year,
      rating: 4,
      swatch: 'from-sky-400 to-blue-800',
      groups: [draft.format],
      description: draft.description.trim(),
      copies: [{ code, status: 'AVAILABLE', location: draft.format === 'physical' ? 'Shelf A1' : 'Online' }],
    },
  ]
  return { books: next }
}

export function setCopyStatus(books, code, status) {
  return books.map((book) => ({
    ...book,
    copies: book.copies.map((copy) => (copy.code === code ? { ...copy, status } : copy)),
  }))
}
