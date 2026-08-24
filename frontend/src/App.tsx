import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import Modal from './components/Modal'
import Panel from './components/Panel'
import AddWords from './components/AddWords'
import WordsTable from './components/WordsTable'
import { register, verifyCode, login, logout, getMe, getWords, getCategories, getStoredEmail, refreshAccessToken, ApiError, User, Word, WordCategory } from './api'


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

    const [modalErrorText, setModalErrorText] = useState<string | null>(null)

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

    const onSubmitEmail = async () => {
        try {
            await register(emailText)
            setModalState(ModalState.SUBMIT_CODE)
        } catch (err) {
            if (err instanceof ApiError && err.status === 409) setModalState(ModalState.LOGIN) // user exists
            else if (err instanceof Error) setModalErrorText(err.message)
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
                    rightButton = {{ label: "Log out", onClick: onLogout, enabled: true }}
                    onClose = {() => setModalOpen(false)}
                >
                    <p className="text-sm text-muted">{user?.email}</p>
                    <p className="text-sm text-muted">{user?.username}</p>
                </Modal>
            ) :
            (modalState == ModalState.SUBMIT_EMAIL) ? (
                <Modal
                    title = "Account"
                    rightButton = {{ label: "Submit", onClick: onSubmitEmail, enabled: emailValid(emailText) }}
                    onClose = {() => setModalOpen(false)}
                >
                    <input type="email" placeholder="Email" value={emailText} onChange={e => setEmailText(e.target.value)} className={inputClass} />
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
    </>)
}

export default App
