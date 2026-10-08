import { useEffect, useState, useCallback } from 'react'
import { supabase } from './supabase'

const toLocalInput = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

// Database row (snake_case) <-> app object (camelCase)
const fromRow = (r) => ({
  id: r.id, company: r.company, title: r.title, link: r.link, dateApplied: r.date_applied,
  status: r.status, salary: r.salary || '', recruiterName: r.recruiter_name || '',
  recruiterEmail: r.recruiter_email || '', cv: r.cv || '', interviewAt: toLocalInput(r.interview_at),
  notes: r.notes || '', checklist: r.checklist || [], updatedAt: new Date(r.updated_at).getTime(),
})
const toRow = (j) => ({
  company: j.company, title: j.title, link: j.link, date_applied: j.dateApplied, status: j.status,
  salary: j.salary || null, recruiter_name: j.recruiterName || null, recruiter_email: j.recruiterEmail || null,
  cv: j.cv || null, interview_at: j.interviewAt ? new Date(j.interviewAt).toISOString() : null,
  notes: j.notes || null, checklist: j.checklist || [], updated_at: new Date().toISOString(),
})

export function useJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('jobs').select('*').order('updated_at', { ascending: false }).then(({ data, error }) => {
      if (error) setError(error.message)
      else setJobs(data.map(fromRow))
      setLoading(false)
    })
  }, [])

  const save = useCallback(async (job) => {
    setError('')
    const q = job.id
      ? supabase.from('jobs').update(toRow(job)).eq('id', job.id)
      : supabase.from('jobs').insert(toRow(job))
    const { data, error } = await q.select().single()
    if (error) return setError(error.message)
    const saved = fromRow(data)
    setJobs((p) => (job.id ? p.map((j) => (j.id === saved.id ? saved : j)) : [saved, ...p]))
  }, [])

  const remove = useCallback(async (id) => {
    setError('')
    const { error } = await supabase.from('jobs').delete().eq('id', id)
    if (error) return setError(error.message)
    setJobs((p) => p.filter((j) => j.id !== id))
  }, [])

  const move = useCallback(async (id, status) => {
    setError('')
    let prev
    setJobs((p) => p.map((j) => {
      if (j.id !== id || j.status === status) return j
      prev = j
      return { ...j, status, updatedAt: Date.now() }
    }))
    if (!prev) return
    const { error } = await supabase.from('jobs').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    if (error) { setError(error.message); setJobs((p) => p.map((j) => (j.id === id ? prev : j))) }
  }, [])

  return { jobs, loading, error, save, remove, move }
}