import { DAY } from '../lib/constants'

export function getReminders(jobs, now = Date.now()) {
  const interviews = jobs.filter((j) => j.interviewAt && new Date(j.interviewAt) >= now && new Date(j.interviewAt) - now < 7 * DAY)
  const followUps = jobs.filter((j) => j.status === 'Applied' && now - j.updatedAt > 7 * DAY)
  return { interviews, followUps }
}

export default function Reminders({ jobs, onEdit }) {
  const { interviews, followUps } = getReminders(jobs)
  if (!interviews.length && !followUps.length) return null
  const Row = ({ j, text }) => (
    <li><button onClick={() => onEdit(j)} className="text-left underline-offset-2 hover:underline">{text}</button></li>
  )
  return (
    <aside aria-label="Reminders" className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
      <ul className="space-y-1">
        {interviews.map((j) => <Row key={j.id} j={j} text={`Interview with ${j.company} on ${new Date(j.interviewAt).toLocaleString()}`} />)}
        {followUps.map((j) => <Row key={j.id} j={j} text={`Follow up with ${j.company}: no update in over 7 days`} />)}
      </ul>
    </aside>
  )
}
