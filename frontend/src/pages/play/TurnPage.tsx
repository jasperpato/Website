import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Category, Word } from "../../api"
import WordList from "./WordList"
import Button from "../../components/Button"

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

    const [gotWords, setGotWords] = useState<Word[]>([])
    const [skippedWords, setSkippedWords] = useState<Word[]>([])

    const moveToGot = (word: Word) => {
        setSkippedWords(prev => prev.filter((w: Word) => w != word))
        setGotWords(prev => [...prev, word])
    }

    const moveToSkipped = (word: Word) => {
        setGotWords(prev => prev.filter((w: Word) => w != word))
        setSkippedWords(prev => [...prev, word])
    }

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

        <div className="flex justify-center gap-3 mt-4">
            <Button
                label="Skip"
                onClick={() => {
                    currentWord && setSkippedWords(prev => [...prev, currentWord])
                    setCurrentWord(pickWord())
                }}
                enabled={categoryWords.length > 0}
                className="w-30"
            />

            <Button
                label="Got it!"
                primary
                onClick={() => {
                    currentWord && setGotWords(prev => [...prev, currentWord])
                    setCurrentWord(pickWord())
                }}
                enabled={categoryWords.length > 0}
                style={category ? { backgroundColor: category.color, borderColor: category.color } : undefined}
                className="w-30"
            />
        </div>

        <div className="flex gap-4 mt-6 px-4">
            <WordList title="Skipped" words={skippedWords} onWordClick={moveToGot} />
            <WordList title="Got" words={gotWords} onWordClick={moveToSkipped} color={category?.color} />
        </div>
    </>
}