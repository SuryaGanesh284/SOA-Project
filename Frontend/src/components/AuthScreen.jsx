import { useState } from 'react'

function AuthScreen({ mode, onModeChange, onClose }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const isRegister = mode === 'register'

  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-canvas p-6 font-sans text-ink">
      <section className="w-full max-w-md rounded-window bg-white p-8 shadow-window">
        <p className="text-sm font-medium text-muted">Archivalia</p>
        <h1 className="mt-2 text-2xl font-semibold">{isRegister ? 'Create an account' : 'Sign in'}</h1>
        <p className="mt-1 text-sm text-muted">
          {isRegister ? 'Register to borrow resources and track fines.' : 'Use your library account to continue.'}
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {isRegister ? (
            <Field label="Name" value={name} onChange={setName} autoComplete="name" />
          ) : null}
          <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
          <Field label="Password" type="password" value={password} onChange={setPassword} autoComplete={isRegister ? 'new-password' : 'current-password'} />
          <button type="submit" className="h-11 w-full rounded-xl bg-navy text-sm font-medium text-white">
            {isRegister ? 'Register' : 'Sign in'}
          </button>
        </form>

        <p className="mt-5 text-sm text-muted">
          {isRegister ? 'Already have an account?' : 'New to Archivalia?'}{' '}
          <button
            type="button"
            onClick={() => onModeChange(isRegister ? 'login' : 'register')}
            className="font-medium text-ink"
          >
            {isRegister ? 'Sign in' : 'Register'}
          </button>
        </p>
        <button type="button" onClick={onClose} className="mt-3 text-sm text-muted hover:text-ink">
          Back to library
        </button>
      </section>
    </div>
  )
}

function Field({ label, type = 'text', value, onChange, autoComplete }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-11 w-full rounded-xl bg-field px-3 font-normal outline-none"
      />
    </label>
  )
}

export default AuthScreen
