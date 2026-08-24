import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import Modal from './components/Modal'
import Panel from './components/Panel'
import AddWords from './components/AddWords'
import WordsTable from './components/WordsTable'
import LinkText from './components/LinkText'
import { register, submitCode, login, logout, getMe, getWords, getCategories, getStoredEmail, refreshAccessToken, ApiError, User, Word, WordCategory, updateUser, loginWithCode } from './api'


const emailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const ModalState = Object.freeze({
    VIEW_ACCOUNT: 'view_account',
    SUBMIT_EMAIL: 'submit_email',
    LOGIN: 'login',
    SUBMIT_CODE: 'submit_code',
    UPDATE_ACCOUNT: 'update_account',
})

const VERIFICATION_CODE_LENGTH = 6
const MIN_PASSWORD_LENGTH = 8

type ModalState = typeof ModalState[keyof typeof ModalState]


function App() {
    // ----- modal state -----

    const [modalOpen, setModalOpen] = useState(false)
    const [modalState, setModalState] = useState<ModalState>(ModalState.SUBMIT_EMAIL)
    const [modalHistory, setModalHistory] = useState<ModalState[]>([])

    const goToModal = (next: ModalState) => {
        setErrorText("")

        if (next == ModalState.UPDATE_ACCOUNT) {
            setUsernameText(user?.username || "")
        }

        setModalHistory(prev => [...prev, modalState])
        setModalState(next)
    }

    const goBack = () => {
        setModalHistory(prev => {
            if (prev.length === 0) return prev
            setModalState(prev[prev.length - 1])
            return prev.slice(0, -1)
        })
    }

    // ----- modal fields -----

    const [emailText, setEmailText] = useState('')
    const [usernameText, setUsernameText] = useState('')
    const [passwordText, setPasswordText] = useState('')
    const [confirmPasswordText, setConfirmPasswordText] = useState('')
    const [codeText, setCodeText] = useState('')

    const [errorText, setErrorText] = useState<string | null>(null)

    const closeModal = () => {
        setModalOpen(false)
        setModalHistory([])
        resetModal()
    }

    const updateUserEnabled = usernameText != "" && ((passwordText == "" && confirmPasswordText == "") || (passwordText.length > MIN_PASSWORD_LENGTH && passwordText == confirmPasswordText))

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
            goToModal(ModalState.SUBMIT_CODE)
            resetModal(true)
        } catch (err) {
            if (err instanceof ApiError && err.status === 409) goToModal(ModalState.LOGIN) // user exists
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
            // closeModal()
            goToModal(ModalState.UPDATE_ACCOUNT)
        } catch (err) {
            if (err instanceof ApiError) setErrorText(err.message)
        }
    }

    const onUpdateAccount = async () => {
        try {
            await updateUser(usernameText, passwordText)
            setErrorText("")
            setPasswordText("")
            setConfirmPasswordText("")
        } catch (err) {
            if (err instanceof ApiError) setErrorText(err.message)
        }
    }

    const onLoginWithCode = async () => {
        try {
            loginWithCode(emailText)
            goToModal(ModalState.SUBMIT_CODE)
        } catch (err) {
            if (err instanceof ApiError) setErrorText(err.message)   
        }
    }

    const inputClass = "border border-border rounded px-3 py-2 text-sm w-full outline-none focus:border-secondary"

    return (<>
        <Header
            onAccountClick={() => {
                setModalOpen(true)
                setModalHistory([])
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
                    leftButton = {{ label: "Update", onClick: () => goToModal(ModalState.UPDATE_ACCOUNT), enabled: true }}
                    rightButton = {{ label: "Log out", onClick: onLogout, enabled: true }}
                    onClose = {closeModal}
                    errorMessage={errorText || undefined}
                >
                    <p className="text-sm text-muted"><strong>Email: </strong>{user?.email}</p>
                    <p className="text-sm text-muted"><strong>Username: </strong>{user?.username}</p>
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
            (modalState == ModalState.LOGIN) ? (
                <Modal
                    title = "Login"
                    rightButton = {{ label: "Log in", onClick: onLogin, enabled: true }}
                    onClose = {closeModal}
                    onBack={goBack}
                    errorMessage={errorText || undefined}
                >
                    <input type="email" placeholder="Email or username" value={emailText} className={inputClass} disabled/>
                    <input type="password" placeholder="Password" value={passwordText} onChange={e => setPasswordText(e.target.value)} className={inputClass} />
                    <LinkText
                        onClick={onLoginWithCode}
                        className="mx-auto"
                    >
                        Use email verification code
                    </LinkText>
                </Modal>
            ) :
            (modalState == ModalState.SUBMIT_CODE) ? (
                <Modal
                    title = "Verify Email"
                    rightButton = {{ label: "Submit", onClick: onSubmitCode, enabled: codeText.length == VERIFICATION_CODE_LENGTH }}
                    onClose = {closeModal}
                    onBack={goBack}
                    errorMessage={errorText || undefined}
                >
                    <p>We sent an email to <strong>{emailText}</strong> with a verification code!</p>
                    <input placeholder="Verification code" value={codeText} onChange={e => setCodeText(e.target.value)} className={inputClass}/>
                </Modal>
            ) : (modalState == ModalState.UPDATE_ACCOUNT) ? (
                <Modal
                    title = "Account"
                    leftButton = {{ label: "Close", onClick: closeModal, enabled: true }}
                    rightButton = {{ label: "Update", onClick: onUpdateAccount, enabled: updateUserEnabled }}
                    onClose = {closeModal}
                    // onBack={() => setModalState(ModalState.SUBMIT_EMAIL)}
                    errorMessage={errorText || undefined}
                >
                    <p>Update your account!</p>
                    <input placeholder="Username" value={usernameText} onChange={e => setUsernameText(e.target.value)} className={inputClass}/>
                    <input type="password" placeholder="New password" value={passwordText} onChange={e => setPasswordText(e.target.value)} className={inputClass}/>
                    <input type="password" placeholder="Confirm password" value={confirmPasswordText} onChange={e => setConfirmPasswordText(e.target.value)} className={inputClass}/>
                </Modal>
            ) : <></>
        )}
    </>)
}

export default App
