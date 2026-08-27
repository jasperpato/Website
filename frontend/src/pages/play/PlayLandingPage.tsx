import { Category } from "../../api"
import { TIME_OPTIONS } from "./PlayPage"
import Dropdown from "../../components/Dropdown"
import BigButton from "../../components/BigButton"

interface PlayLandingPageProps {
    categories: Category[],
    seconds: number,
    setSeconds: (s: number) => void,
    setCategory: (c: Category) => void,
    setTurn: (b: boolean) => void,
}

export default function PlayLandingPage({ categories, seconds, setSeconds, setCategory, setTurn }: PlayLandingPageProps) {

    const onClick = (c: Category) => {
        setCategory(c)
        setTurn(true)
    }

    return <>
        <main className="flex flex-col items-center gap-6 p-4">
            <div className="w-48">
                <Dropdown
                    value={seconds}
                    onChange={setSeconds}
                    options={TIME_OPTIONS.map(s => ({ value: s, label: `${s} seconds` }))}
                />
            </div>

            <div className="flex flex-col gap-4">
                {categories.map(c => (
                    <BigButton
                        key={c.id}
                        text={c.name}
                        color={c.color}
                        onClick={() => onClick(c)}
                    />
                ))}
            </div>
        </main>
    </>
}