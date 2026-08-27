import { useState, useEffect } from 'react';
import { addWord } from '../../api';
import Dropdown from '../../components/Dropdown';
import PanelBox from '../../components/PanelBox';

export default function AddWords({ categories, onWordAdded, loggedIn }) {
  const [word, setWord] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (categories.length > 0 && categoryId === '') setCategoryId(categories[0].id);
  }, [categories, categoryId]);

  const hasCategories = categories.length > 0;
  const canAdd = loggedIn && hasCategories && categoryId !== '' && word.trim().length > 0;

  const handleAdd = async () => {
    if (!canAdd) return;
    setError(null);
    try {
      await addWord(word.trim(), categoryId);
      setWord('');
      onWordAdded?.();
    } catch (e) {
      setError(e.message);
    }
  };

  const inputClass = "border border-border rounded px-3 py-2 outline-none focus:border-secondary w-full";

  return (
    <PanelBox title="Add Word">
      <div className="flex flex-col gap-2">
        <Dropdown
          value={categoryId}
          onChange={setCategoryId}
          placeholder="No categories"
          disabled={!loggedIn || !hasCategories}
          options={categories.map(c => ({ value: c.id, label: c.name, color: c.color }))}
        />
        <input
          type="text"
          value={word}
          onChange={e => setWord(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder={loggedIn ? "Enter a word" : "Sign in to add words"}
          disabled={!loggedIn}
          className={`${inputClass} ${!loggedIn ? 'opacity-40' : ''}`}
        />
        <button
          onClick={handleAdd}
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
