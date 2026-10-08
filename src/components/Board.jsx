import { DndContext, PointerSensor, TouchSensor, KeyboardSensor, useSensor, useSensors, useDraggable, useDroppable } from '@dnd-kit/core'
import { STATUSES, DAY } from '../lib/constants'

// One color pair per status: column background + the little dot in the header
const TONE = {
  Wishlist: { bg: 'bg-wishlist', dot: 'bg-violet-400' },
  Applied: { bg: 'bg-applied', dot: 'bg-sky-400' },
  Interview: { bg: 'bg-interview', dot: 'bg-amber-400' },
  Offer: { bg: 'bg-offer', dot: 'bg-emerald-400' },
  Rejected: { bg: 'bg-rejected', dot: 'bg-rose-400' },
}

function Chip({ className, children }) {
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>{children}</span>
}

// "Interview today", "Interview tomorrow", "Interview in 3 days"
function interviewLabel(iso) {
  const days = Math.ceil((new Date(iso) - Date.now()) / DAY)
  if (days < 0) return null
  if (days === 0) return 'Interview today'
  return days === 1 ? 'Interview tomorrow' : `Interview in ${days} days`
}

function Card({ job, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: job.id })
  const style = transform ? { transform: `translate(${transform.x}px,${transform.y}px)` } : undefined
  const interview = job.interviewAt && interviewLabel(job.interviewAt)
  const needsFollowUp = job.status === 'Applied' && Date.now() - job.updatedAt > 7 * DAY

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}
      className={`touch-manipulation rounded-2xl bg-white p-3.5 ring-1 ring-black/5 transition-shadow ${
        isDragging ? 'relative z-10 rotate-2 shadow-xl' : 'shadow-sm hover:shadow-md'
      }`}>
      <button onClick={() => onEdit(job)} className="block w-full text-left">
        <span className="block font-display text-lg leading-tight">{job.company}</span>
        <span className="block text-sm text-ink/70">{job.title}</span>
        <span className="mt-1 block text-xs text-ink/50">Applied {job.dateApplied}</span>
      </button>
      {(interview || needsFollowUp) && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {interview && <Chip className="bg-interview">{interview}</Chip>}
          {needsFollowUp && <Chip className="bg-rejected">Follow up</Chip>}
        </div>
      )}
      <a href={job.link} target="_blank" rel="noopener noreferrer"
        className="mt-2 inline-block text-xs font-bold text-teal-700 underline underline-offset-2">
        Open posting
      </a>
    </li>
  )
}

function Column({ status, jobs, onEdit }) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const tone = TONE[status]
  return (
    <section aria-label={`${status}, ${jobs.length} jobs`}
      className={`w-72 shrink-0 snap-center rounded-3xl p-3 transition-colors md:w-auto md:min-w-0 md:flex-1 ${tone.bg} ${isOver ? 'ring-2 ring-teal-600' : ''}`}>
      <h2 className="mb-3 flex items-center gap-2 px-1 font-display text-lg">
        <span className={`size-3 rounded-full ${tone.dot}`} aria-hidden="true" />
        {status}
        <span className="ml-auto rounded-full bg-white/70 px-2.5 text-sm">{jobs.length}</span>
      </h2>
      <ul ref={setNodeRef} className="flex min-h-28 flex-col gap-2.5">
        {jobs.map((j) => <Card key={j.id} job={j} onEdit={onEdit} />)}
        {jobs.length === 0 && (
          <li className="rounded-2xl border-2 border-dashed border-ink/15 p-4 text-center text-sm text-ink/40">Drop a card here</li>
        )}
      </ul>
    </section>
  )
}

export default function Board({ jobs, onMove, onEdit }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor))
  return (
    <DndContext sensors={sensors} onDragEnd={({ active, over }) => over && onMove(active.id, over.id)}>
      <div className="flex snap-x gap-3 overflow-x-auto pb-4">
        {STATUSES.map((s) => <Column key={s} status={s} jobs={jobs.filter((j) => j.status === s)} onEdit={onEdit} />)}
      </div>
    </DndContext>
  )
}