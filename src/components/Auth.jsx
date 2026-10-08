import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [mode, setMode] = useState('in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true); setMsg('')
    const { data, error } = mode === 'in'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })
    setBusy(false)
    if (error) setMsg(error.message)
    else if (mode === 'up' && !data.session) setMsg('Account created. Check your email to confirm it, then log in.')
  }

  const input = 'mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-base'
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-teal-800">JobTrail</h1>
        <p className="mb-4 text-stone-600">{mode === 'in' ? 'Log in to see your applications.' : 'Create an account to start tracking.'}</p>
        <label className="block text-sm font-medium">Email
          <input required type="email" autoComplete="email" className={input} value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="mt-3 block text-sm font-medium">Password
          <input required type="password" minLength={6} autoComplete={mode === 'in' ? 'current-password' : 'new-password'}
            className={input} value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {msg && <p role="alert" className="mt-3 text-sm text-red-700">{msg}</p>}
        <button disabled={busy} className="mt-4 w-full rounded-md bg-teal-700 px-4 py-2 font-semibold text-white disabled:opacity-60">
          {busy ? 'Please wait…' : mode === 'in' ? 'Log in' : 'Sign up'}</button>
        <button type="button" onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setMsg('') }} className="mt-3 w-full text-sm text-teal-800 underline">
          {mode === 'in' ? 'New here? Create an account' : 'Have an account? Log in'}</button>
      </form>
    </main>
  )
}