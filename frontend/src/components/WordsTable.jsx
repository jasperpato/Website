import { useMemo, useState } from 'react';
import { CheckCircle, HelpCircle, XCircle } from 'lucide-react';
import { updateWord } from '../api';
import Category from './Category';
import PanelBox from './PanelBox';
import Table from './Table';

function ApprovedCell({ value }) {
  if (value === true) return <span className="text-600 text-sm">Approved</span>;
  if (value === false) return <span className="text-500 text-sm">Denied</span>;
  return <span className="text-sm">Pending</span>;
}

function ApproveActions({ word, onRefresh }) {
  const handle = async (approved) => {
    await updateWord(word.id, { approved });
    onRefresh();
  };

  return (
    <div className="flex items-center gap-2">
      <ApprovedCell value={word.approved} />
      <button onClick={() => handle(false)} className="cursor-pointer text-error hover:opacity-70">
        <XCircle size={18} />
      </button>
      <button onClick={() => handle(null)} className="cursor-pointer text-warning hover:opacity-70">
        <HelpCircle size={18} />
      </button>
      <button onClick={() => handle(true)} className="cursor-pointer text-success hover:opacity-70">
        <CheckCircle size={18} />
      </button>
    </div>
  );
}

export default function WordsTable({ words, isStaff, onRefresh }) {
  const [sortedBy, setSortedBy] = useState('submitted_at');
  const [ascending, setAscending] = useState(false);

  const handleSort = (sortKey) => {
    if (!sortKey) return;
    if (sortKey === sortedBy) {
      setAscending(a => !a);
    } else {
      setSortedBy(sortKey);
      setAscending(true);
    }
  };

  const sortedWords = useMemo(() => {
    const sorted = [...words];
    if (sortedBy === 'alphabetical') {
      sorted.sort((a, b) => a.word.localeCompare(b.word));
    } else if (sortedBy === 'category') {
      sorted.sort((a, b) => (a.category?.name ?? '').localeCompare(b.category?.name ?? ''));
    } else if (sortedBy === 'submitted_at') {
      sorted.sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at));
    }
    return ascending ? sorted : sorted.reverse();
  }, [words, sortedBy, ascending]);

  const visibleWords = useMemo(() =>
    isStaff ? sortedWords : sortedWords.filter(w => w.approved !== false),
    [sortedWords, isStaff]
  );

  const columns = useMemo(() => {
    const base = [
      { accessorKey: 'word', header: 'Word', sortKey: 'alphabetical' },
      {
        accessorKey: 'category',
        header: 'Category',
        sortKey: 'category',
        cell: ({ getValue }) => <Category category={getValue()} />,
      },
      {
        accessorKey: 'submitted_at',
        header: 'Submitted At',
        sortKey: 'submitted_at',
        cell: ({ getValue }) => {
          const v = getValue();
          return v ? new Date(v).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—';
        },
      },
      {
        accessorKey: 'approved',
        header: 'Status',
        cell: isStaff
          ? ({ row }) => <ApproveActions word={row.original} onRefresh={onRefresh} />
          : ({ getValue }) => <ApprovedCell value={getValue()} />,
      },
    ];

    return base.map(col => ({
      ...col,
      header: () => col.sortKey ? (
        <button
          onClick={() => handleSort(col.sortKey)}
          className="flex items-center gap-1 cursor-pointer font-semibold text-muted hover:text-primary"
        >
          {col.header}
          {sortedBy === col.sortKey && <span className="text-xs">{ascending ? '↑' : '↓'}</span>}
        </button>
      ) : <span className="font-semibold text-muted">{col.header}</span>,
    }));
  }, [sortedBy, ascending, isStaff, onRefresh]);

  return (
    <PanelBox title="Word List">
      <Table columns={columns} data={visibleWords} pageSize={10} resetPageKey={`${sortedBy}-${ascending}`} />
    </PanelBox>
  );
}
