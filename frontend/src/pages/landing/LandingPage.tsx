import { useNavigate } from 'react-router-dom'
import BigButton from '../../components/BigButton'

export default function LandingPage() {
    const navigate = useNavigate()

    return (
        <main className="flex flex-col lg:flex-row items-center justify-center gap-6 p-4 h-[calc(100vh-3.75rem)]">
            <BigButton text="Play!" onClick={() => navigate('/play')} textColor="text-secondary" borderColor="border-secondary" />
            <BigButton text="Contribute" onClick={() => navigate('/contribute')} textColor="text-primary" borderColor="border-primary" />
        </main>
    )
}