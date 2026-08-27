import Panel from '../../components/Panel'
import AddWords from './AddWords'
import WordsTable from './WordsTable'
import { User, Word, Category } from '../../api'

interface ContributePageProps {
    words: Word[]
    categories: Category[]
    user: User | null
    loggedIn: boolean
    onWordAdded: () => void
    onRefresh: () => void
}

export default function ContributePage({ words, categories, user, loggedIn, onWordAdded, onRefresh }: ContributePageProps) {
    return (
        <main className="flex flex-col lg:flex-row gap-4 p-4">
            <Panel>
                <AddWords
                    categories={categories}
                    onWordAdded={onWordAdded}
                    loggedIn={loggedIn}
                />
            </Panel>
            <Panel>
                <WordsTable
                    words={words}
                    isStaff={user?.is_staff === true}
                    onRefresh={onRefresh}
                />
            </Panel>
        </main>
    )
}
