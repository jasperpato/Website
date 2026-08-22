import { useState } from 'react'
import Header from './components/Header'
import Modal from './components/Modal'
import Panel from './components/Panel'
import AddWords from './components/AddWords'
import { register, verifyCode, login, logout } from './api'

const emailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

function App() {
  const [mode, setMode] = useState('register')
  const [step, setStep] = useState('form') // 'form' | 'verify'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState(null)
  const [loggedInEmail, setLoggedInEmail] = useState(null)
  const [accountOpen, setAccountOpen] = useState(false)

  const isRegister = mode === 'register'

  const canSubmit = step === 'verify'
    ? code.length === 6
    : isRegister
      ? emailValid(email) && password.length > 0 && password === confirmPassword
      : emailValid(email) && password.length > 0

  const handleSubmit = async () => {
    setError(null)
    try {
      if (step === 'verify') {
        await verifyCode(email, code)
        setLoggedInEmail(email)
      } else if (isRegister) {
        await register(email, password)
        setStep('verify')
      } else {
        await login(email, password)
        setLoggedInEmail(email)
      }
    } catch (e) {
      setError(e.message)
    }
  }

  const handleLogout = () => {
    logout()
    setLoggedInEmail(null)
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setCode('')
    setStep('form')
    setAccountOpen(false)
  }

  const switchMode = () => {
    setMode(isRegister ? 'login' : 'register')
    setError(null)
  }

  const inputClass = "border border-border rounded px-3 py-2 text-sm w-full outline-none focus:border-secondary"

  const modalTitle = step === 'verify' ? 'Check your email' : isRegister ? 'Register' : 'Log in'
  const rightLabel = step === 'verify' ? 'Verify' : isRegister ? 'Register' : 'Log in'

  return (
    <>
      <Header onAccountClick={() => setAccountOpen(true)} />
      <main className="flex flex-col lg:flex-row gap-4 p-4">
        <Panel><AddWords /></Panel>
        <Panel />
      </main>
      {!loggedInEmail && (
        <Modal
          title={modalTitle}
          leftAction={step === 'form' ? { label: isRegister ? 'Log in' : 'Register', onClick: switchMode } : null}
          rightAction={{ label: rightLabel, onClick: handleSubmit }}
          rightEnabled={canSubmit}
        >
          {step === 'verify' ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted">We sent a 6-digit code to {email}.</p>
              <input type="text" placeholder="000000" maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} className={inputClass} />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className={inputClass} />
              {isRegister && (
                <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputClass} />
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          )}
        </Modal>
      )}
      {loggedInEmail && accountOpen && (
        <Modal
          title="Account"
          onClose={() => setAccountOpen(false)}
          leftAction={null}
          rightAction={{ label: 'Log out', onClick: handleLogout }}
        >
          <p className="text-sm text-muted">{loggedInEmail}</p>
        </Modal>
      )}
    </>
  )
}

export default App
