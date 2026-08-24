import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import Modal from './components/Modal'
import Panel from './components/Panel'
import AddWords from './components/AddWords'
import WordsTable from './components/WordsTable'
import { register, submitCode, login, logout, getMe, getWords, getCategories, getStoredEmail, refreshAccessToken, ApiError, User, Word, WordCategory } from './api'


const emailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const ModalState = Object.freeze({
    VIEW_ACCOUNT: 'view_account',
    SUBMIT_EMAIL: 'submit_email',
    REGISTER: 'register',
    LOGIN: 'login',
    SUBMIT_CODE: 'submit_code',
    UPDATE_ACCOUNT: 'update_account',
})

type ModalState = typeof ModalState[keyof typeof ModalState]


function App() {
    // ----- modal state -----

    const [modalOpen, setModalOpen] = useState(false)
    const [modalState, setModalState] = useState<ModalState>(ModalState.SUBMIT_EMAIL)

    // ----- modal fields -----

    const [emailText, setEmailText] = useState('')
    const [passwordText, setPasswordText] = useState('')
    const [confirmPasswordText, setConfirmPasswordText] = useState('')
    const [codeText, setCodeText] = useState('')

    const [errorText, setErrorText] = useState<string | null>(null)

    const closeModal = () => {
        setModalOpen(false)
        resetModal()
    }

    // ----- backend objects -----

    const [user, setUser] = useState<User | null>(null)
    const [words, setWords] = useState<Word[]>([])
    const [categories, setCategories] = useState<WordCategory[]>([])

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

    // does this updating
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
        if (!loggedIn) return
        const id = setInterval(fetchObjects, 10000)
        return () => clearInterval(id)
    }, [loggedIn, fetchObjects])


    const resetModal = (keepEmail: boolean = false) => {
        if (!keepEmail) setEmailText('')
        setPasswordText('')
        setConfirmPasswordText('')
        setCodeText('')
        setErrorText('')
    } 

    const onLogout = () => {
        logout()
        setUser(null)
        setWords([])
        setCategories([])
        closeModal()
    }

    const onSubmitEmail = async () => {
        try {
            await register(emailText)
            setModalState(ModalState.SUBMIT_CODE)
            resetModal(true)
        } catch (err) {
            if (err instanceof ApiError && err.status === 409) setModalState(ModalState.LOGIN) // user exists
            else if (err instanceof Error) setErrorText(err.message)
        }
    }

    const onLogin = async () => {
        try {
            await login(emailText, passwordText)
            fetchObjects()
            closeModal()
        } catch (err) {
            if (err instanceof ApiError) setErrorText(err.message)
        }
    }

    const onSubmitCode = async () => {
        try {
            await submitCode(emailText, codeText)
            fetchObjects()
            closeModal()
        } catch (err) {
            if (err instanceof ApiError) setErrorText(err.message)
        }
    }

    const inputClass = "border border-border rounded px-3 py-2 text-sm w-full outline-none focus:border-secondary"

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
                    rightButton = {{ label: "Log out", onClick: onLogout, enabled: true }}
                    onClose = {closeModal}
                    errorMessage={errorText || undefined}
                >
                    <p className="text-sm text-muted">{user?.email}</p>
                    <p className="text-sm text-muted">{user?.username}</p>
                </Modal>
            ) :
            (modalState == ModalState.SUBMIT_EMAIL) ? (
                <Modal
                    title = "Account"
                    rightButton = {{ label: "Submit", onClick: onSubmitEmail, enabled: emailValid(emailText) }}
                    onClose = {closeModal}
                    errorMessage={errorText || undefined}
                >
                    <input type="email" placeholder="Email" value={emailText} onChange={e => setEmailText(e.target.value)} className={inputClass} />
                </Modal>
            ) :
            (modalState == ModalState.REGISTER) ? (
                <Modal>
                </Modal>
            ) :
            (modalState == ModalState.LOGIN) ? (
                <Modal
                    title = "Login"
                    rightButton = {{ label: "Log in", onClick: onLogin, enabled: true }}
                    onClose = {closeModal}
                    onBack={() => setModalState(ModalState.SUBMIT_EMAIL)}
                    errorMessage={errorText || undefined}
                >
                    <input type="email" placeholder="Email or Username" value={emailText} className={inputClass} disabled/>
                    <input type="password" placeholder="Password" value={passwordText} onChange={e => setPasswordText(e.target.value)} className={inputClass} />
                </Modal>
            ) :
            (modalState == ModalState.SUBMIT_CODE) ? (
                <Modal
                    title = "Verify Email"
                    rightButton = {{ label: "Submit", onClick: onSubmitCode, enabled: true }}
                    onClose = {() => setModalOpen(false)}
                    onBack={() => setModalState(ModalState.SUBMIT_EMAIL)}
                    errorMessage={errorText || undefined}
                >
                    <p>We sent an email to <strong>{emailText}</strong> with a verification code!</p>
                    <input placeholder="Verification Code" value={codeText} onChange={e => setCodeText(e.target.value)} className={inputClass}/>
                </Modal>
            ) : ( // (modalState == ModalState.UPDATE_ACCOUNT)
                <Modal>
                </Modal>
            )
        )}
    </>)
}

export default App
