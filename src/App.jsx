import { useMemo, useState } from 'react'
import { useJobs } from './lib/useJobs'
import { STATUSES } from './lib/constants'
import Board from './components/Board'
import JobForm from './components/JobForm'
import Reminders from './components/Reminders'
import Stats from './components/Stats'

export default function App({ user, onSignOut }) {
  const { jobs, loading, error, save, remove, move } = useJobs()
  const [view, setView] = useState('board')
  const [editing, setEditing] = useState(null) // null | 'new' | job
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [since, setSince] = useState('')

  const shown = useMemo(() => jobs.filter((j) =>
    (!q || j.company.toLowerCase().includes(q.toLowerCase())) &&
    (!status || j.status === status) && (!since || j.dateApplied >= since)), [jobs, q, status, since])

  const field = 'rounded-full border border-ink/15 bg-white px-4 py-2'
  return (
    <div className="min-h-screen text-ink">
      <header className="sticky top-0 z-10 px-3 pt-3">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 rounded-3xl bg-white/90 px-4 py-2.5 shadow-sm ring-1 ring-black/5 backdrop-blur">
          <h1 className="font-display text-xl text-teal-800">JobTrail</h1>
          <nav aria-label="Views" className="flex gap-1">
            {['board', 'stats'].map((v) => (
              <button key={v} onClick={() => setView(v)} aria-current={view === v}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${view === v ? 'bg-ink text-white' : 'text-ink/70 hover:bg-canvas'}`}>
                {v === 'stats' ? 'Dashboard' : 'Board'}
              </button>
            ))}
          </nav>
          <span className="ml-auto hidden text-sm text-ink/50 md:inline">{user.email}</span>
          <button onClick={() => setEditing('new')} className="ml-auto rounded-full bg-teal-700 px-5 py-2 text-sm font-bold text-white md:ml-0">Add job</button>
          <button onClick={onSignOut} className="rounded-full border border-ink/15 px-4 py-2 text-sm">Log out</button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-5">
        {error && <p role="alert" className="mb-4 rounded-2xl bg-rejected p-3 text-sm">Something went wrong: {error}</p>}
        <Reminders jobs={jobs} onEdit={setEditing} />
        {view === 'board' ? (
          <>
            <div className="mb-5 flex flex-wrap gap-2">
              <input aria-label="Search by company" placeholder="Search company" className={field + ' min-w-40 flex-1'} value={q} onChange={(e) => setQ(e.target.value)} />
              <select aria-label="Filter by status" className={field} value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <input aria-label="Applied since" type="date" className={field} value={since} onChange={(e) => setSince(e.target.value)} />
            </div>
            {loading && <p className="mb-4 text-ink/60">Loading your applications…</p>}
            {!loading && jobs.length === 0 && (
              <p className="mb-5 rounded-2xl bg-white p-4 text-ink/70 ring-1 ring-black/5">
                Your board is ready. Choose “Add job”, then drag the card to a column as things move along.
              </p>
            )}
            <Board jobs={shown} onMove={move} onEdit={setEditing} />
          </>
        ) : <Stats jobs={jobs} />}
      </main>
      {editing && <JobForm job={editing === 'new' ? null : editing} onSave={save} onDelete={remove} onClose={() => setEditing(null)} />}
    </div>
  )
}