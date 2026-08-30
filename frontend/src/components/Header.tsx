import { Link, useNavigate } from 'react-router-dom';
import { Menu as MenuIcon, UserCircle } from 'lucide-react';
import { useState } from 'react';
import BigButton from './BigButton';

interface HeaderProps {
  openAccountModal: () => void
}

export default function Header({ openAccountModal }: HeaderProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const itemClass = "w-full text-left font-semibold px-6 py-4 cursor-pointer bg-transparent border-none hover:bg-gray-50"

  const goTo = (path: string) => {
    setOpen(false);
    navigate(path);
  }

  return (
    <>
      <header className="flex justify-between items-center px-6 h-15 border-b border-border">
        <div className="flex items-center gap-4">
          <button onClick={() => setOpen(true)} className="cursor-pointer bg-transparent border-none flex items-center text-secondary">
            <MenuIcon size={28} />
          </button>
          {/* <Link to="/" className="font-bold text-xl text-primary no-underline">JP</Link> */}
        </div>
        <button onClick={() => openAccountModal()} className="cursor-pointer bg-transparent border-none flex items-center text-primary">
          <UserCircle size={28} />
        </button>
      </header>

      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      />
      <nav
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[Canvas] shadow-lg flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* <div className="mx-4 my-2 mt-4">
          <BigButton text="Play!" onClick={() => goTo('/play')} color="var(--color-secondary)" fullWidth small />
        </div> */}
        {/* <button onClick={() => goTo('/')} className={`${itemClass} text-primary`}>
          Home
        </button> */}
        <div className="gap-4 flex flex-row mx-4 py-4 border-b border-primary">
          <img src="/favicon.svg" alt="icon" className="h-6 w-6"/>
          <p className="font-semibold">jasperpato</p>
        </div>
        <button onClick={() => goTo('/play')} className={`${itemClass} text-secondary`}>
          Play!
        </button>
        <button onClick={() => goTo('/add-words')} className={`${itemClass} text-primary`}>
          Add Words
        </button>
        <button onClick={() => goTo('/feedback')} className={`${itemClass} text-primary`}>
          Feedback
        </button>
      </nav>
    </>
  );
}
