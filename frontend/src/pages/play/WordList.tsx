import { Word } from "../../api"

interface WordListProps {
    title: string,
    words: Word[],
    onWordClick: (w: Word) => void,
    color?: string,
}

export default function WordList({ title, words, onWordClick, color }: WordListProps) {
    return (
        <div className="flex-1 flex flex-col gap-2 min-w-0">
            <p className="font-bold text-sm uppercase tracking-wide text-muted pl-2" style={color ? { color } : undefined}>
                {words.length > 0 ? title : ""}
            </p>
            <div className="flex flex-col gap-1">
                {words.map((w: Word) => (
                    <div
                        key={w.id}
                        onClick={() => onWordClick(w)}
                        className="px-3 py-2 rounded border border-border bg-white cursor-pointer truncate transition-opacity hover:opacity-70"
                    >
                        {w.word}
                    </div>
                ))}
            </div>
        </div>
    )
}