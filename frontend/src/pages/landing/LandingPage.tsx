import { useNavigate } from 'react-router-dom'
import BigButton from '../../components/BigButton'

export default function LandingPage() {
    const navigate = useNavigate()

    return (
        <main className="flex flex-col items-center justify-center gap-6 p-4 h-[calc(100vh-3.75rem)]">
            <BigButton text="Play!" onClick={() => navigate('/play')} color="var(--color-secondary)" />
            <BigButton text="Add Words" onClick={() => navigate('/add-words')} color="var(--color-primary)" />
        </main>
    )
}