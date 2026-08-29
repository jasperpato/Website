import { useState } from 'react'
import Dropdown from '../../components/Dropdown'
import BigButton from '../../components/BigButton'
import { Category, Word } from '../../api'
import PlayLandingPage from './PlayLandingPage'
import TurnPage from './TurnPage'
import LoadingMessage from '../../components/LoadingMessage'

interface PlayPageProps {
    categories: Category[],
    words: Word[],
}

export const TIME_OPTIONS= [30, 45, 60]


export default function PlayPage({ categories, words }: PlayPageProps) {
    const [seconds, setSeconds] = useState<number>(TIME_OPTIONS[1])
    const [category, setCategory] = useState<Category | undefined>(undefined)
    const [turn, setTurn] = useState(false)

    return (
        (categories.length > 0 && words.length > 0) ? (
            turn ? <TurnPage
                words={words}
                seconds={seconds}
                category={category}
                setTurn={setTurn}
            /> : <PlayLandingPage
                categories={categories}
                seconds={seconds}
                setSeconds={setSeconds}
                setCategory={setCategory}
                setTurn={setTurn}
            />
        ) : <LoadingMessage />
    )
}
