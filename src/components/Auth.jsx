import { useState } from 'react'
import { supabase } from '../lib/supabase'

// The five board colors, shown as a little preview strip
const DOTS = ['bg-wishlist', 'bg-applied', 'bg-interview', 'bg-offer', 'bg-rejected']

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

  const input = 'mt-1 w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-base font-normal'
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white/90 p-7 shadow-lg ring-1 ring-black/5">
        <div className="mb-4 flex gap-1.5" aria-hidden="true">
          {DOTS.map((c) => <span key={c} className={`h-3 flex-1 rounded-full ${c}`} />)}
        </div>
        <h1 className="font-display text-3xl text-teal-800">JobTrail</h1>
        <p className="mb-5 text-ink/70">
          {mode === 'in' ? 'Welcome back. Log in to see your board.' : 'Create an account to start tracking.'}
        </p>

        <label className="block text-sm font-bold">Email
          <input required type="email" autoComplete="email" className={input}
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="mt-3 block text-sm font-bold">Password
          <input required type="password" minLength={6} autoComplete={mode === 'in' ? 'current-password' : 'new-password'}
            className={input} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        {msg && <p role="alert" className="mt-3 rounded-2xl bg-rejected px-3 py-2 text-sm">{msg}</p>}

        <button disabled={busy}
          className="mt-5 w-full rounded-full bg-teal-700 px-4 py-3 font-bold text-white transition-colors hover:bg-teal-800 disabled:opacity-60">
          {busy ? 'Please wait…' : mode === 'in' ? 'Log in' : 'Sign up'}
        </button>
        <button type="button" onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setMsg('') }}
          className="mt-3 w-full text-sm font-semibold text-teal-800 underline underline-offset-2">
          {mode === 'in' ? 'New here? Create an account' : 'Have an account? Log in'}
        </button>
      </form>
    </main>
  )
}