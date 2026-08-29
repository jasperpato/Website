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
        <main className="flex flex-col items-center gap-6 p-8 max-sm:portrait:min-h-[calc(100vh-3.75rem)]">
            <div className="w-full">
                <Dropdown
                    value={seconds}
                    onChange={setSeconds}
                    options={TIME_OPTIONS.map(s => ({ value: s, label: `${s} seconds` }))}
                />
            </div>

            <div className="flex flex-col gap-4 max-sm:portrait:flex-1 max-sm:portrait:w-full"> {/* max-sm:portrait:justify-evenly"> */}
                {categories
                    .sort((a: Category, b: Category) => a.order - b.order)
                    .map(c => (
                        <BigButton
                            key={c.id}
                            text={c.name}
                            color={c.color}
                            onClick={() => onClick(c)}
                            className="max-sm:portrait:w-full"
                        />
                    )
                )}
            </div>
        </main>
    </>
}