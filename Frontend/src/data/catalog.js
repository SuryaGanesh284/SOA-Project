export const catalog = [
  { title: 'The Design of Everyday Things', author: 'Don Norman', rating: 5, swatch: 'from-sky-500 to-blue-900' },
  { title: 'Clean Code', author: 'Robert C. Martin', rating: 4, swatch: 'from-indigo-500 to-slate-900' },
  { title: 'The Pragmatic Programmer', author: 'David Thomas', rating: 5, swatch: 'from-emerald-500 to-teal-900' },
  { title: 'Algorithms to Live By', author: 'Brian Christian', rating: 4, swatch: 'from-amber-500 to-orange-900' },
  { title: 'Structure and Interpretation', author: 'Harold Abelson', rating: 5, swatch: 'from-rose-500 to-red-950' },
  { title: 'Deep Work', author: 'Cal Newport', rating: 5, swatch: 'from-sky-400 to-blue-800' },
  { title: 'Atomic Habits', author: 'James Clear', rating: 4, swatch: 'from-amber-300 to-orange-700' },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', rating: 5, swatch: 'from-slate-400 to-slate-800' },
  { title: 'The Art of Computer Programming', author: 'Donald Knuth', rating: 5, swatch: 'from-rose-400 to-red-900' },
  { title: 'Gödel, Escher, Bach', author: 'Douglas Hofstadter', rating: 4, swatch: 'from-emerald-400 to-teal-800' },
]

export function searchCatalog(query) {
  const term = query.trim().toLowerCase()
  if (!term) return []
  return catalog.filter((book) => {
    return book.title.toLowerCase().includes(term) || book.author.toLowerCase().includes(term)
  })
}
