import { useEffect, useState } from 'react';
import { addWord, getCategories } from '../api';
import Dropdown from './Dropdown';
import PanelBox from './PanelBox';

export default function AddWords() {
  const [word, setWord] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    getCategories().then(data => {
      setCategories(data);
      if (data.length > 0) setCategoryId(data[0].id);
    }).catch(() => {});
  }, []);

  const hasCategories = categories.length > 0;
  const canAdd = hasCategories && categoryId !== '' && word.trim().length > 0;

  const handleAdd = async () => {
    if (!canAdd) return;
    setError(null);
    try {
      await addWord(word.trim(), categoryId);
      setWord('');
    } catch (e) {
      setError(e.message);
    }
  };

  const inputClass = "border border-border rounded px-3 py-2 text-sm outline-none focus:border-secondary w-full";

  return (
    <PanelBox title="Add Words">
      <div className="flex flex-col gap-2">
        <Dropdown
          value={categoryId}
          onChange={setCategoryId}
          placeholder="No categories"
          disabled={!hasCategories}
          options={categories.map(c => ({ value: c.id, label: c.name }))}
        />
        <input
          type="text"
          value={word}
          onChange={e => setWord(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Enter a word"
          className={inputClass}
        />
        <button
          onClick={handleAdd}
          disabled={!canAdd}
          className={`px-4 py-2 rounded bg-primary text-white text-sm w-full transition-opacity ${canAdd ? 'cursor-pointer' : 'opacity-40'}`}
        >
          Add
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </PanelBox>
  );
}
