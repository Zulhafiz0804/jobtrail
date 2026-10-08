import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import Auth from './components/Auth'
import { supabase } from './lib/supabase'

function Root() {
  const [session, setSession] = useState(undefined) // undefined = still checking
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])
  if (session === undefined) return <p className="p-6">Loading…</p>
  if (!session) return <Auth />
  return <App key={session.user.id} user={session.user} onSignOut={() => supabase.auth.signOut()} />
}

createRoot(document.getElementById('root')).render(<Root />)