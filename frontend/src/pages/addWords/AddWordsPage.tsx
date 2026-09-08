import Panel from '../../components/Panel'
import AddWordsPanel from './AddWordsPanel'
import WordsTable from './WordsTable'
import { User, Word, Category } from '../../api'
import { BannerProps } from '../../components/Banner'

interface AddWordsPageProps {
    words: Word[]
    categories: Category[]
    user: User | null
    loggedIn: boolean
    onWordAdded: (word: string) => void
    onRefresh: () => void,
    openAccountModal: (msg: string) => void,
    setGlobalBanner: (b: BannerProps) => void
}

export default function AddWordsPage({ words, categories, user, loggedIn, onWordAdded, onRefresh, openAccountModal, setGlobalBanner }: AddWordsPageProps) {
    return (
        <main className="flex flex-col lg:flex-row lg:items-start gap-4 p-4">
            <Panel>
                <AddWordsPanel
                    categories={categories}
                    onWordAdded={onWordAdded}
                    loggedIn={loggedIn}
                    openAccountModal={openAccountModal}
                    setGlobalBanner={setGlobalBanner}
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
