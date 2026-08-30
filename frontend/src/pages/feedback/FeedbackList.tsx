import { Feedback } from '../../api';
import PanelBox from '../../components/PanelBox';

interface FeedbackListProps {
    feedback: Feedback[]
}

export default function FeedbackList({ feedback }: FeedbackListProps) {
    return (
        <PanelBox title="Feedback">
            <div className="flex flex-col gap-3">
                {feedback.length === 0 ? (
                    <p className="text-muted text-sm">No feedback yet</p>
                ) : (
                    feedback.map(f => (
                        <div key={f.id} className="border border-border rounded px-3 py-2">
                            <p className="font-semibold text-sm">{f.name}</p>
                            <p className="text-sm text-muted">{f.message}</p>
                        </div>
                    ))
                )}
            </div>
        </PanelBox>
    );
}
