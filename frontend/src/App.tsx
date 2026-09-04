import { useState, useEffect, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Modal from './components/Modal'
import LinkText from './components/LinkText'
import LandingPage from './pages/landing/LandingPage'
import AddWordsPage from './pages/addWords/AddWordsPage'
import FeedbackPage from './pages/feedback/FeedbackPage'
import BoardPage from './pages/board/BoardPage'
import PlayPage from './pages/play/PlayPage'
import Resume from './pages/resume/Resume'
import { Banner, BannerProps, BannerType } from './components/Banner'
import { register, submitCode, login, logout, getMe, getWords, getCategories, getFeedback, getStoredEmail, refreshAccessToken, ApiError, User, Word, Category, Feedback, updateUser, loginWithCode } from './api'


const emailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const ModalState = Object.freeze({
    VIEW_ACCOUNT: 'view_account',
    SUBMIT_EMAIL: 'submit_email',
    LOGIN: 'login',
    REGISTER_WITH_CODE: 'register_with_code',
    LOGIN_WITH_CODE: 'login_with_code',
    UPDATE_ACCOUNT: 'update_account',
})

type ModalState = typeof ModalState[keyof typeof ModalState]

const VERIFICATION_CODE_LENGTH = 6
const MIN_PASSWORD_LENGTH = 8

function App() {
    // ----- modal state -----

    const [modalOpen, setModalOpen] = useState(false)
    const [modalState, setModalState] = useState<ModalState>(ModalState.SUBMIT_EMAIL)
    const [modalHistory, setModalHistory] = useState<ModalState[]>([])

    const prevModalState = modalHistory.at(-1)

    const goToModal = (next: ModalState) => {
        setModalBannerProps(undefined)

        if (next == ModalState.UPDATE_ACCOUNT) {
            fetchMe().then((user) =>
                setUsernameText(user?.username || "")
            )
        }

        setModalHistory(prev => [...prev, modalState])
        setModalState(next)
    }

    const goBack = () => {
        setModalBannerProps(undefined)
        setCodeText("")
        setPasswordText("")
        setConfirmPasswordText("")

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

    const [modalMessage, setModalMessage] = useState("")

    const [modalBannerProps, setModalBannerProps] = useState<BannerProps | undefined>(undefined)

    const setError = (text: string) => setModalBannerProps({ text, type: BannerType.ERROR } as BannerProps)

    const closeModal = () => {
        setModalOpen(false)
        setModalHistory([])
        resetModal()
    }

    const updateUserEnabled = usernameText != "" && ((passwordText == "" && confirmPasswordText == "") || (passwordText.length > MIN_PASSWORD_LENGTH && passwordText == confirmPasswordText))

    // ----- backend objects -----

    const [user, setUser] = useState<User | null>(null)
    const [words, setWords] = useState<Word[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [feedback, setFeedback] = useState<Feedback[]>([])

    const fetchMe = useCallback(() => getMe().then((user) => {
        setUser(user)
        return user
    }).catch(() => { return undefined }), [])

    const _fetchWords = useCallback(() => getWords().then(setWords).catch(() => {}), [])
    const _fetchCategories = useCallback(() => getCategories().then(setCategories).catch(() => {}), [])
    const _fetchFeedback = useCallback(() => getFeedback().then(setFeedback).catch(() => {}), [])

    const fetchObjects = useCallback(() => {
        fetchMe()
        _fetchWords()
        _fetchCategories()
        _fetchFeedback()
    }, [fetchMe, _fetchWords, _fetchCategories, _fetchFeedback])

    const loggedIn = user != null

    // ----- initial load on start up -----

    // does this updating
    useEffect(() => {
        fetchObjects()

        const stored = getStoredEmail()
        if (!stored) return

        refreshAccessToken()
            .then(fetchObjects)
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
        setUsernameText('');
        setPasswordText('')
        setConfirmPasswordText('')
        setCodeText('')
        setModalBannerProps(undefined)
        setModalMessage("")
    } 

    const onLogout = () => {
        logout()
        setUser(null)
        resetModal()
        goToModal(ModalState.SUBMIT_EMAIL)
    }

    const onSubmitEmail = async () => {
        try {
            await register(emailText)
            goToModal(ModalState.REGISTER_WITH_CODE)
            resetModal(true)
        } catch (err) {
            if (err instanceof ApiError && err.status === 409) goToModal(ModalState.LOGIN) // user exists
            else if (err instanceof Error) setError(err.message)
        }
    }

    const onLogin = async () => {
        try {
            await login(emailText, passwordText)
            fetchObjects()
            closeModal()
        } catch (err) {
            if (err instanceof ApiError) setError(err.message)
        }
    }

    const onSubmitCode = async (modalState: ModalState) => {
        try {
            await submitCode(emailText, codeText)
            fetchObjects()
            resetModal()
            if (modalState == ModalState.REGISTER_WITH_CODE) goToModal(ModalState.UPDATE_ACCOUNT)
            else closeModal()
        } catch (err) {
            if (err instanceof ApiError) setError(err.message)
        }
    }

    const onUpdateAccount = async () => {
        try {
            const user = await updateUser(usernameText, passwordText)
            setUser(user)

            setModalBannerProps({ text: "User updated!", type: BannerType.SUCCESS, duration: 3000, key: Date.now().toString() } as BannerProps)
            setPasswordText("")
            setConfirmPasswordText("")
        } catch (err) {
            if (err instanceof ApiError) setError(err.message)
        }
    }

    const onLoginWithCode = async () => {
        try {
            await loginWithCode(emailText)
            setCodeText("")
            goToModal(ModalState.LOGIN_WITH_CODE)
        } catch (err) {
            if (err instanceof ApiError) setError(err.message)
        }
    }

    const inputClass = "border border-border rounded px-3 py-2 w-full outline-none focus:border-secondary"

    const defaultModalMessage = "Enter your email to sign in or register!"

    const openAccountModal = (msg: string = defaultModalMessage) => {
        setModalMessage(msg)
        setModalOpen(true)
        setModalHistory([])
        setModalState(loggedIn ? ModalState.VIEW_ACCOUNT : ModalState.SUBMIT_EMAIL)
    }

    const [globalBannerProps, setGlobalBannerProps] = useState<BannerProps | undefined>(undefined);

    return (<>
        <div className="relative">
            <Header
                openAccountModal={openAccountModal}
            />

            {globalBannerProps && (
                <div className="absolute top-full left-0 right-0 z-40 m-2 bg-bg">
                    <Banner {...globalBannerProps} />
                </div>
            )}
        </div>

        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
                path="/add-words"
                element={
                    <AddWordsPage
                        words={words}
                        categories={categories}
                        user={user}
                        loggedIn={loggedIn}
                        onWordAdded={fetchObjects}
                        onRefresh={fetchObjects}
                        openAccountModal={openAccountModal}
                    />
                }
            />
            <Route path="/play" element={<PlayPage categories={categories} words={words} setGlobalBannerProps={setGlobalBannerProps} />} />
            <Route path="/board" element={<BoardPage categories={categories} />} />
            <Route
                path="/feedback"
                element={
                    <FeedbackPage
                        feedback={feedback}
                        onFeedbackAdded={fetchObjects}
                    />
                }
            />
            <Route path="/resume" element={<Resume />} />
        </Routes>

        {modalOpen && (
            (modalState == ModalState.VIEW_ACCOUNT) ? (
                <Modal
                    title = "Account"
                    leftButton = {{ label: "Update", onClick: () => goToModal(ModalState.UPDATE_ACCOUNT), enabled: true }}
                    rightButton = {{ label: "Log out", onClick: onLogout, enabled: true }}
                    onClose = {closeModal}
                    bannerProps={modalBannerProps}
                >
                    <p className="text-muted"><strong>Email: </strong>{user?.email}</p>
                    <p className="text-muted"><strong>Username: </strong>{user?.username}</p>
                </Modal>
            ) :
            (modalState == ModalState.SUBMIT_EMAIL) ? (
                <Modal
                    title = "Account"
                    rightButton = {{ label: "Submit", onClick: onSubmitEmail, enabled: emailValid(emailText) }}
                    onClose = {closeModal}
                    bannerProps={modalBannerProps}
                    modalMessage={modalMessage ?? defaultModalMessage}
                >
                    <input type="email" placeholder="Email" value={emailText} onChange={e => setEmailText(e.target.value)} className={inputClass} />
                </Modal>
            ) :
            (modalState == ModalState.LOGIN) ? (
                <Modal
                    title = "Login"
                    rightButton = {{ label: "Sign in", onClick: onLogin, enabled: true }}
                    onClose = {closeModal}
                    onBack={goBack}
                    bannerProps={modalBannerProps}
                >
                    <input type="email" placeholder="Email or username" value={emailText} className={inputClass} disabled/>
                    <input type="password" placeholder="Password" value={passwordText} onChange={e => setPasswordText(e.target.value)} className={inputClass} />
                    <LinkText
                        onClick={onLoginWithCode}
                        className="self-center"
                    >
                        Use email verification code instead
                    </LinkText>
                </Modal>
            ) :
            (modalState == ModalState.REGISTER_WITH_CODE || modalState == ModalState.LOGIN_WITH_CODE) ? (
                <Modal
                    title = "Verify Email"
                    leftButton = {{ label: "Resend code", onClick: onLoginWithCode, enabled: true }}
                    rightButton = {{ label: "Submit", onClick: () => onSubmitCode(modalState), enabled: codeText.length == VERIFICATION_CODE_LENGTH }}
                    onClose = {closeModal}
                    onBack={goBack}
                    bannerProps={modalBannerProps}
                >
                    <p>We sent an email to <strong>{emailText}</strong> with a verification code!</p>
                    <input placeholder="Verification code" value={codeText} onChange={e => setCodeText(e.target.value)} className={inputClass}/>
                    <div className="flex justify-center gap-8">
                        <a href="https://mail.google.com/" target="_blank" rel="noopener noreferrer" aria-label="Open Gmail" className="flex items-center justify-center hover:opacity-70">
                            <img src="/gmail_icon.svg" alt="Gmail" className="w-6 h-6" />
                        </a>
                        <a href="https://outlook.cloud.microsoft/mail/" target="_blank" rel="noopener noreferrer" aria-label="Open Outlook" className="flex items-center justify-center hover:opacity-70">
                            <img src="/outlook_icon.svg" alt="Outlook" className="w-6 h-6" />
                        </a>
                    </div>
                </Modal>
            ) : (modalState == ModalState.UPDATE_ACCOUNT) ? (
                <Modal
                    title = "Account"
                    leftButton = {{ label: (prevModalState == ModalState.VIEW_ACCOUNT) ? "Close" : "Skip", onClick: closeModal, enabled: true }}
                    rightButton = {{ label: "Update", onClick: onUpdateAccount, enabled: updateUserEnabled }}
                    onClose = {closeModal}
                    onBack={(prevModalState == ModalState.VIEW_ACCOUNT) ? goBack : undefined}
                    bannerProps={modalBannerProps}
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
