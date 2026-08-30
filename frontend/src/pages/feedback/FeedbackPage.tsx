import Panel from '../../components/Panel'
import FeedbackForm from './FeedbackForm'
import FeedbackList from './FeedbackList'
import { Feedback } from '../../api'

interface FeedbackPageProps {
    feedback: Feedback[]
    onFeedbackAdded: () => void
}

export default function FeedbackPage({ feedback, onFeedbackAdded }: FeedbackPageProps) {
    return (
        <main className="flex flex-col lg:flex-row lg:items-start gap-4 p-4">
            <Panel>
                <FeedbackForm onFeedbackAdded={onFeedbackAdded} />
            </Panel>
            <Panel>
                <FeedbackList feedback={feedback} />
            </Panel>
        </main>
    )
}
