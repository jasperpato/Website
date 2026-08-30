import { useState } from 'react';
import { postFeedback, ApiError } from '../../api';
import PanelBox from '../../components/PanelBox';
import TextInput from '../../components/TextInput';

interface FeedbackFormProps {
    onFeedbackAdded: () => void
}

export default function FeedbackForm({ onFeedbackAdded }: FeedbackFormProps) {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const canSubmit = name.trim().length > 0 && message.trim().length > 0;

    const handleSubmit = async () => {
        if (!canSubmit) return;
        setError(undefined);
        try {
            await postFeedback(name.trim(), message.trim(), isPublic);
            setName('');
            setMessage('');
            setIsPublic(false);
            onFeedbackAdded?.();
        } catch (err) {
            if (err instanceof ApiError) setError(err.message);
        }
    };

    const inputClass = "border border-border rounded px-3 py-2 outline-none focus:border-secondary w-full";

    return (
        <PanelBox title="Send Feedback">
            <div className="flex flex-col gap-2">
                <TextInput value={name} onChange={setName} placeholder="Your name" />
                <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Your feedback"
                    rows={4}
                    className={`${inputClass} resize-none`}
                />
                <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={e => setIsPublic(e.target.checked)}
                    />
                    Display this feedback publicly
                </label>
                <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className={`px-4 py-2 rounded bg-primary text-white w-full transition-opacity ${canSubmit ? 'cursor-pointer' : 'opacity-40'}`}
                >
                    Submit
                </button>
                {error && <p className="text-error text-sm">{error}</p>}
            </div>
        </PanelBox>
    );
}
