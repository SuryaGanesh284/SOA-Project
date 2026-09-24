export const catalog = [
  { title: 'The Design of Everyday Things', author: 'Don Norman', rating: 5, swatch: 'from-sky-500 to-blue-900', groups: ['physical', 'reading-now', 'quiet'] },
  { title: 'Clean Code', author: 'Robert C. Martin', rating: 4, swatch: 'from-indigo-500 to-slate-900', groups: ['ebooks', 'saved', 'research'] },
  { title: 'The Pragmatic Programmer', author: 'David Thomas', rating: 5, swatch: 'from-emerald-500 to-teal-900', groups: ['ebooks', 'saved'] },
  { title: 'Algorithms to Live By', author: 'Brian Christian', rating: 4, swatch: 'from-amber-500 to-orange-900', groups: ['audio', 'due-soon'] },
  { title: 'Structure and Interpretation', author: 'Harold Abelson', rating: 5, swatch: 'from-rose-500 to-red-950', groups: ['papers', 'research'] },
  { title: 'Deep Work', author: 'Cal Newport', rating: 5, swatch: 'from-sky-400 to-blue-800', groups: ['ebooks', 'reading-now', 'quiet'] },
  { title: 'Atomic Habits', author: 'James Clear', rating: 4, swatch: 'from-amber-300 to-orange-700', groups: ['audio', 'saved', 'quiet'] },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', rating: 5, swatch: 'from-slate-400 to-slate-800', groups: ['papers', 'due-soon', 'history'] },
  { title: 'The Art of Computer Programming', author: 'Donald Knuth', rating: 5, swatch: 'from-rose-400 to-red-900', groups: ['physical', 'classics'] },
  { title: 'Gödel, Escher, Bach', author: 'Douglas Hofstadter', rating: 4, swatch: 'from-emerald-400 to-teal-800', groups: ['videos', 'classics'] },
]

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
