import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Category, Word } from "../../api"

interface TurnPageProps {
    words: Word[],
    seconds: number,
    category?: Category,
    setTurn: (b: boolean) => void
}

export default function TurnPage({ words, seconds, category, setTurn }: TurnPageProps) {
    const [remaining, setRemaining] = useState(seconds)

    const categoryWords = words.filter(w => w.category?.id === category?.id && w.approved !== false)

    const pickWord = () => categoryWords.length > 0
        ? categoryWords[Math.floor(Math.random() * categoryWords.length)]
        : undefined

    const [currentWord, setCurrentWord] = useState<Word | undefined>(pickWord)

    useEffect(() => {
        if (remaining <= 0) return

        const id = setInterval(() => {
            setRemaining(r => Math.max(r - 1, 0))
        }, 1000)

        return () => clearInterval(id)
    }, [remaining])

    return <>
        <div className="relative flex items-center justify-center px-6 h-15">
            <button onClick={() => setTurn(false)} className="absolute left-6 cursor-pointer bg-transparent border-none flex items-center text-muted hover:text-primary" style={category ? { color: category.color } : undefined}>
                <ArrowLeft size={28} />
            </button>
            <p className="font-bold text-2xl" style={category ? { color: category.color } : undefined}>{category?.name}</p>
        </div>
        <p className="font-bold text-xl text-center text-muted">00:{remaining < 10 ? "0" : ""}{remaining}</p>

        <p className="font-bold text-3xl text-center py-16">{currentWord?.word}</p>

        <div className="flex justify-center mt-4">
            <button
                onClick={() => setCurrentWord(pickWord())}
                disabled={categoryWords.length === 0}
                style={category ? { backgroundColor: category.color } : undefined}
                className={`px-4 py-2 rounded bg-primary text-white transition-opacity ${categoryWords.length === 0 ? 'opacity-40' : 'cursor-pointer'}`}
            >
                Got it!
            </button>
        </div>
    </>
}