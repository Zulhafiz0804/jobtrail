import { useState } from 'react'
import { STATUSES, today } from '../lib/constants'

const blank = { company: '', title: '', link: '', dateApplied: today(), status: 'Applied', salary: '', recruiterName: '', recruiterEmail: '', cv: '', interviewAt: '', notes: '', checklist: [] }

function Field({ label, children }) {
  return <label className="block text-sm font-medium text-stone-700">{label}{children}</label>
}
const input = 'mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-base font-normal'

export default function JobForm({ job, onSave, onDelete, onClose }) {
  const [f, setF] = useState(job || blank)
  const [item, setItem] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const addItem = () => { if (item.trim()) { setF({ ...f, checklist: [...f.checklist, { t: item.trim(), done: false }] }); setItem('') } }
  const toggle = (i) => setF({ ...f, checklist: f.checklist.map((c, n) => (n === i ? { ...c, done: !c.done } : c)) })

  return (
    <div role="dialog" aria-modal="true" aria-label={job ? 'Edit application' : 'Add application'}
      className="fixed inset-0 z-20 flex items-end justify-center bg-black/40 sm:items-center" onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <form onSubmit={(e) => { e.preventDefault(); onSave(f); onClose() }}
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-stone-50 p-5 sm:max-w-xl sm:rounded-2xl">
        <h2 className="mb-3 text-xl font-bold">{job ? 'Edit application' : 'Add application'}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Company *"><input required autoFocus className={input} value={f.company} onChange={set('company')} /></Field>
          <Field label="Job title *"><input required className={input} value={f.title} onChange={set('title')} /></Field>
          <Field label="Job link *"><input required type="url" className={input} value={f.link} onChange={set('link')} placeholder="https://" /></Field>
          <Field label="Date applied *"><input required type="date" className={input} value={f.dateApplied} onChange={set('dateApplied')} /></Field>
        </div>
        <details className="mt-4 rounded-md border border-stone-200 p-3" open={!!job}>
          <summary className="cursor-pointer text-sm font-semibold">More details</summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Status"><select className={input} value={f.status} onChange={set('status')}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label="Salary range"><input className={input} value={f.salary} onChange={set('salary')} /></Field>
            <Field label="Recruiter name"><input className={input} value={f.recruiterName} onChange={set('recruiterName')} /></Field>
            <Field label="Recruiter email"><input type="email" className={input} value={f.recruiterEmail} onChange={set('recruiterEmail')} /></Field>
            <Field label="CV version"><input className={input} value={f.cv} onChange={set('cv')} /></Field>
            <Field label="Interview date"><input type="datetime-local" className={input} value={f.interviewAt} onChange={set('interviewAt')} /></Field>
          </div>
          <div className="mt-3"><Field label="Notes"><textarea rows="3" className={input} value={f.notes} onChange={set('notes')} /></Field></div>
          <fieldset className="mt-3">
            <legend className="text-sm font-medium text-stone-700">Interview prep checklist</legend>
            {f.checklist.map((c, i) => (
              <label key={i} className="mt-1 flex items-center gap-2 text-sm"><input type="checkbox" checked={c.done} onChange={() => toggle(i)} className="size-4" />
                <span className={c.done ? 'line-through text-stone-400' : ''}>{c.t}</span></label>
            ))}
            <div className="mt-2 flex gap-2">
              <input aria-label="New checklist item" className={input + ' mt-0'} value={item} onChange={(e) => setItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())} placeholder="e.g. Research the team" />
              <button type="button" onClick={addItem} className="rounded-md border border-stone-300 px-3">Add</button>
            </div>
          </fieldset>
        </details>
        <div className="mt-5 flex gap-2">
          <button className="rounded-md bg-teal-700 px-4 py-2 font-semibold text-white">Save</button>
          <button type="button" onClick={onClose} className="rounded-md border border-stone-300 px-4 py-2">Cancel</button>
          {job && <button type="button" onClick={() => { onDelete(job.id); onClose() }} className="ml-auto rounded-md px-4 py-2 text-red-700">Delete</button>}
        </div>
      </form>
    </div>
  )
}
