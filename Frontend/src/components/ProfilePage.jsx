import { useState } from 'react'

function ProfilePage({ profile, onSave }) {
  const [draft, setDraft] = useState(profile)
  const [saved, setSaved] = useState(false)

  function update(field, value) {
    setSaved(false)
    setDraft((current) => ({ ...current, [field]: value }))
  }

  return (
    <section className="px-6" aria-label="Profile">
      <h2 className="text-lg font-semibold">Profile</h2>
      <form
        className="mt-5 max-w-md space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          onSave(draft)
          setSaved(true)
        }}
      >
        <Field label="Name" value={draft.name} onChange={(value) => update('name', value)} />
        <Field label="User ID" value={draft.userId} readOnly />
        <Field label="Email" type="email" value={draft.email} onChange={(value) => update('email', value)} />
        <Field label="Phone" value={draft.phone} onChange={(value) => update('phone', value)} />
        <button type="submit" className="h-10 rounded-xl bg-navy px-4 text-sm font-medium text-white">
          Save
        </button>
        {saved ? <p className="text-sm text-emerald-600">Profile saved.</p> : null}
      </form>
    </section>
  )
}

function Field({ label, value, onChange, type = 'text', readOnly }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={readOnly ? undefined : (event) => onChange(event.target.value)}
        className="mt-1 h-11 w-full rounded-xl bg-field px-3 font-normal outline-none read-only:text-muted"
      />
    </label>
  )
}

export default ProfilePage
