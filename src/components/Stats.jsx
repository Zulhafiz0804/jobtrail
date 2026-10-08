import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

// Returns the Monday of the week a date falls in
const weekStart = (d) => {
  const x = new Date(d)
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7))
  return x.toISOString().slice(0, 10)
}

// How to group a date like "2026-10-05" for each view
const keyFor = {
  day: (d) => d,
  week: weekStart,
  month: (d) => d.slice(0, 7),
}

// Shared chart styling
const INK = '#2b2540'
const GRID = '#e3dcf5'
const tick = { fill: INK, fontSize: 13 }
const tooltipStyle = { borderRadius: 16, border: 'none', boxShadow: '0 4px 14px rgba(43,37,64,0.15)' }

const card = 'rounded-3xl bg-white/85 p-5 ring-1 ring-black/5'

export default function Stats({ jobs }) {
  const [range, setRange] = useState('week')

  // Each list below is a smaller slice of the one before it
  const applied = jobs.filter((j) => j.status !== 'Wishlist')
  const replied = applied.filter(
    (j) => ['Interview', 'Offer', 'Rejected'].includes(j.status) || j.interviewAt
  )
  const interviewed = applied.filter(
    (j) => j.interviewAt || ['Interview', 'Offer'].includes(j.status)
  )
  const offers = applied.filter((j) => j.status === 'Offer')

  const rate = applied.length ? Math.round((replied.length / applied.length) * 100) : 0

  // Same colors as the board columns, so the dashboard feels connected to it
  const funnel = [
    { stage: 'Applied', count: applied.length, color: '#8ec5f7' },
    { stage: 'Replied', count: replied.length, color: '#c4b0fa' },
    { stage: 'Interview', count: interviewed.length, color: '#f7cf5e' },
    { stage: 'Offer', count: offers.length, color: '#6fd4a0' },
  ]

  // Count applications per day / week / month, depending on the selected button
  const byPeriod = {}
  applied.forEach((j) => {
    const k = keyFor[range](j.dateApplied)
    byPeriod[k] = (byPeriod[k] || 0) + 1
  })
  const series = Object.keys(byPeriod).sort().map((k) => ({
    period: range === 'month' ? k : k.slice(5),
    applications: byPeriod[k],
  }))

  const tiles = [
    { label: 'Applications sent', value: applied.length, hint: 'Wishlist not counted', bg: 'bg-applied' },
    { label: 'Response rate', value: `${rate}%`, hint: `${replied.length} of ${applied.length} replied`, bg: 'bg-interview' },
    { label: 'Interviews', value: interviewed.length, hint: `${offers.length} ${offers.length === 1 ? 'offer' : 'offers'} so far`, bg: 'bg-offer' },
  ]

  return (
    <div className="space-y-4">
      <dl className="grid gap-3 sm:grid-cols-3">
        {tiles.map((t) => (
          <div key={t.label} className={`rounded-3xl p-5 ${t.bg}`}>
            <dt className="text-sm font-semibold text-ink/70">{t.label}</dt>
            <dd className="font-display text-5xl leading-tight">{t.value}</dd>
            <p className="text-sm text-ink/60">{t.hint}</p>
          </div>
        ))}
      </dl>

      <div className={card}>
        <h2 className="font-display text-xl">Your search funnel</h2>
        <p className="mb-2 text-sm text-ink/60">How far your applications get.</p>
        {applied.length ? (
          <div className="h-56" role="img" aria-label="Funnel: applied, replied, interview, offer">
            <ResponsiveContainer>
              <BarChart data={funnel} layout="vertical" margin={{ right: 30 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={tick} stroke={GRID} />
                <YAxis type="category" dataKey="stage" width={80} tick={tick} stroke={GRID} />
                <Tooltip cursor={{ fill: 'rgba(43,37,64,0.05)' }} contentStyle={tooltipStyle} />
                <Bar dataKey="count" barSize={30} radius={[0, 14, 14, 0]}>
                  {funnel.map((f) => <Cell key={f.stage} fill={f.color} />)}
                  <LabelList dataKey="count" position="right" fill={INK} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="py-6 text-center text-ink/50">Move a job out of Wishlist to start your funnel.</p>
        )}
      </div>

      <div className={card}>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl">Applications per {range}</h2>
          <div className="flex gap-1" role="group" aria-label="Group by">
            {['day', 'week', 'month'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                aria-pressed={range === r}
                className={`rounded-full px-4 py-1 text-sm font-semibold capitalize ${
                  range === r ? 'bg-ink text-white' : 'bg-white ring-1 ring-ink/15'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        {series.length ? (
          <div className="h-64" role="img" aria-label={`Bar chart of applications per ${range}`}>
            <ResponsiveContainer>
              <BarChart data={series}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="period" tick={tick} stroke={GRID} />
                <YAxis allowDecimals={false} tick={tick} stroke={GRID} />
                <Tooltip cursor={{ fill: 'rgba(43,37,64,0.05)' }} contentStyle={tooltipStyle} />
                <Bar dataKey="applications" fill="#8ec5f7" radius={[12, 12, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="py-6 text-center text-ink/50">Add an application to see your activity.</p>
        )}
      </div>
    </div>
  )
}