import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import Modal from './components/Modal'
import Panel from './components/Panel'
import AddWords from './components/AddWords'
import WordsTable from './components/WordsTable'
import { register, verifyCode, login, logout, getMe, getWords, getCategories, getStoredEmail, refreshAccessToken } from './api'


const emailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)


function App() {
    // ----- modal state -----

    const ModalState = Object.freeze({
        VIEW_ACCOUNT: 'view_account',
        SUBMIT_EMAIL: 'submit_email',
        REGISTER: 'register',
        LOGIN: 'login',
        SUBMIT_CODE: 'submit_code',
        UPDATE_ACCOUNT: 'update_account',
    })

    const [modalOpen, setModalOpen] = useState(false)
    const [modalState, setModalState] = useState(ModalState.SUBMIT_EMAIL)

    // ----- modal fields -----

    const [emailText, setEmailText] = useState('')
    const [passwordText, setPasswordText] = useState('')
    const [confirmPasswordText, setConfirmPasswordText] = useState('')
    const [codeText, setCodeText] = useState('')

    const [modalErrorText, setModalErrorText] = useState(null)

    // ----- backend objects -----

    const [user, setUser] = useState(null)
    const [words, setWords] = useState([])
    const [categories, setCategories] = useState([])

    const fetchMe = useCallback(() => getMe().then(setUser).catch(() => {}), [])
    const fetchWords = useCallback(() => getWords().then(setWords).catch(() => {}), [])
    const fetchCategories = useCallback(() => getCategories().then(setCategories).catch(() => {}), [])

    const fetchObjects = useCallback(() => {
        fetchMe()
        fetchWords()
        fetchCategories()
    }, [fetchMe, fetchWords, fetchCategories])

    const loggedIn = user != null

    // ----- initial load on start up -----

    useEffect(() => {
        fetchWords()

        const stored = getStoredEmail()
        if (!stored) return

        refreshAccessToken()
            .then(() => getMe())
            .then(user => {
                setUser(user)
                fetchCategories()
            })
            .catch(() => logout())
    }, [])

    // ----- start a callback to refresh all objects on interval -----

    useEffect(() => {
        if (!user) return
        const id = setInterval(fetchObjects, 10000)
        return () => clearInterval(id)
    }, [loggedInEmail, fetchObjects])


    const onLogout = () => {
        logout()
        setUser(null)
        setWords([])
        setCategories([])
        setEmailText('')
        setPasswordText('')
        setConfirmPasswordText('')
        setCodeText('')
        setModalOpen(false)
    }

    const onSubmitEmail = () => {
        try {
            await register(emailText)
            setModalState(ModalState.SUBMIT_CODE)
        } catch (err) {
            if (err.status === 409) {
                // setModalErrorText('An account with that email already exists — try logging in instead.')
                setModalState(ModalState.LOGIN)
            }
            else {
                setModalErrorText(err.message)
            }
        }
    }

    const inputClass = ""

    return (<>
        <Header
            onAccountClick={() => {
                setModalOpen(true)
                setModalState(loggedIn ? ModalState.VIEW_ACCOUNT : ModalState.SUBMIT_EMAIL)
            }}
        />
        
        <main className="flex flex-col lg:flex-row gap-4 p-4">
            <Panel>
                <AddWords
                    categories={categories}
                    onWordAdded={fetchWords}
                    loggedIn={loggedIn}
                />
            </Panel>
            <Panel>
                <WordsTable
                    words={words}
                    isStaff={user?.is_staff}
                    onRefresh={fetchObjects}
                />
            </Panel>
        </main>

        {modalOpen && (
            (modalState == ModalState.VIEW_ACCOUNT) ? (
                <Modal
                    title = "Account"
                    rightLabel = "Log out"
                    rightAction = {onLogout}
                    onClose = {() => setModalOpen(false)}
                >
                    <p className="text-sm text-muted">{user?.email}</p>
                    <p className="text-sm text-muted">{user?.username}</p>
                </Modal>
            ) :
            (modalState == ModalState.SUBMIT_EMAIL) ? (
                <Modal
                    title = "Account"
                    rightLabel = "Submit"
                    rightAction = {onSubmitEmail}
                    rightEnabled = {emailValid(emailText)}
                    onClose = {() => setModalOpen(false)}
                >
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmailText(e.target.value)} className={inputClass} />
                </Modal>
            ) :
            (modalState == ModalState.REGISTER) ? (
                <Modal>
                </Modal>
            ) :
            (modalState == ModalState.LOGIN) ? (
                <Modal>
                </Modal>
            ) :
            (modalState == ModalState.SUBMIT_CODE) ? (
                <Modal>
                </Modal>
            ) : ( // (modalState == ModalState.UPDATE_ACCOUNT)
                <Modal>
                </Modal>
            )
        )}

        <Modal
            title={modalTitle}
            onClose={() => setAccountOpen(false)}
            onBack={step === 'verify' ? () => setStep('form') : undefined}
            leftAction={step === 'form' ? { label: isRegister ? 'Log in' : 'Register', onClick: switchMode } : null}
            rightAction={{ label: rightLabel, onClick: handleSubmit }}
            rightEnabled={canSubmit}
        >
            {step === 'verify' ? (
            <div className="flex flex-col gap-3">
                <p className="text-sm text-muted">We sent a 6-digit code to {email}.</p>
                <input type="text" placeholder="000000" maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} className={inputClass} />
                {error && <p className="text-error-500 text-sm">{error}</p>}
            </div>
            ) : (
            <div className="flex flex-col gap-3">
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className={inputClass} />
                {isRegister && (
                <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputClass} />
                )}
                {error && <p className="text-error-500 text-sm">{error}</p>}
            </div>
            )}
        </Modal>
        )}
        {loggedInEmail && accountOpen && (
        <Modal
            title="Account"
            onClose={() => setModalOpen(false)}
            leftAction={null}
            rightAction={{ label: 'Log out', onClick: onLogout }}
        >
            <p className="text-sm text-muted">{loggedInEmail}</p>
        </Modal>
        )}
    </>)
}

export default App
