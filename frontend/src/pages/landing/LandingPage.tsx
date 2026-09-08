import { useNavigate } from 'react-router-dom'
import BigButton from '../../components/BigButton'
import hovercraft from '../../assets/hovercraft.jpeg'
import { useState } from 'react'

export default function LandingPage() {
    const navigate = useNavigate()
    const [colorToggle, setColorToggle] = useState(true)

    return (
        <main
            className="max-w-xl mx-auto w-full flex flex-col items-center justify-center gap-12 p-4 h-[calc(100vh-3.75rem)] overflow-hidden"
        >
            <h2>Welcome to <span onClick={() => setColorToggle(p => !p)} className={`cursor-pointer select-none ${colorToggle ? "text-secondary" : "text-primary"}`}>jasperpato.com</span>!</h2>

            {/* <p className="text-justify">This website is for when you are out and about and want a quick game of Articulate.
                If you have the physical board game nearby, get off this and use that!</p> */}

            <div className="flex flex-col gap-6 items-center">
                <BigButton text="Play!" onClick={() => navigate('/play')} filled={true} color="var(--color-secondary)" textColor="white" />
                <BigButton text="Add Words" onClick={() => navigate('/add-words')} filled={true} color="var(--color-primary)" textColor='white'/>
            </div>
        </main>
    )
}