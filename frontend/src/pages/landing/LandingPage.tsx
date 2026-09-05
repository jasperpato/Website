import { useNavigate } from 'react-router-dom'
import BigButton from '../../components/BigButton'
import hovercraft from '../../assets/hovercraft.jpeg'

export default function LandingPage() {
    const navigate = useNavigate()

    return (
        <main
            className="flex flex-col items-center justify-center gap-6 p-4 h-[calc(100vh-3.75rem)] overflow-hidden"
            
            // style={{
            //     backgroundImage: `url(${hovercraft})`,
            //     backgroundSize: 'cover',
            //     backgroundPosition: 'center',
            //     backgroundRepeat: 'no-repeat',
            // }}
        >
            <BigButton text="Play!" onClick={() => navigate('/play')} filled={true} color="var(--color-secondary)" textColor="white" />
            <BigButton text="Add Words" onClick={() => navigate('/add-words')} filled={true} color="var(--color-primary)" textColor='white'/>
        </main>
    )
}