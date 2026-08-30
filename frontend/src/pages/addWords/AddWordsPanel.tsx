import { useState, useEffect } from 'react';
import { addWord, ApiError, Category } from '../../api';
import Dropdown from '../../components/Dropdown';
import PanelBox from '../../components/PanelBox';


interface AddWordsPanel {
  categories: Category[],
  onWordAdded: () => void,
  loggedIn: boolean,
  openAccountModal: (msg: string) => void
}

export default function AddWordsPanel({ categories, onWordAdded, loggedIn, openAccountModal }: AddWordsPanel) {
  const [word, setWord] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (categories.length > 0 && categoryId === undefined) setCategoryId(categories[0].id);
  }, [categories, categoryId]);

  const hasCategories = categories.length > 0;
  const canAdd = // loggedIn &&
    hasCategories && categoryId !== undefined && word.trim().length > 0;

  const handleAdd = async () => {
    if (!canAdd) return;
    setError(undefined);
    try {
      await addWord(word.trim(), categoryId);
      setWord('');
      onWordAdded?.();
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    }
  };

  const inputClass = "border border-border rounded px-3 py-2 outline-none focus:border-secondary w-full";

  return (
    <PanelBox title="Add Word">
      <div className="flex flex-col gap-2">
        <Dropdown
          selectedId={String(categoryId)}
          placeholder="No categories"
          disabled={!loggedIn || !hasCategories}
          options={categories.map((c: Category) => ({
            id: String(c.id),
            display: (
              <span className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: c.color }} />
                {c.name}
              </span>
            ),
            onClick: () => setCategoryId(c.id),
          }))}
        />
        <input
          type="text"
          value={word}
          onChange={e => setWord(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Enter a word"
          // disabled={!loggedIn}
          className={`${inputClass} ${!loggedIn ? 'opacity-40' : ''}`}
        />
        <button
          onClick={loggedIn ? handleAdd : () => openAccountModal("Sign in or register to add words!")}
          disabled={!canAdd}
          className={`px-4 py-2 rounded bg-primary text-white w-full transition-opacity ${canAdd ? 'cursor-pointer' : 'opacity-40'}`}
        >
          Add
        </button>
        {error && <p className="text-error-500 text-sm">{error}</p>}
      </div>
    </PanelBox>
  );
}
