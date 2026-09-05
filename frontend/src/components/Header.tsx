import { Link, useNavigate } from 'react-router-dom';
import { Menu as MenuIcon, UserCircle } from 'lucide-react';
import { ReactNode, useState } from 'react';
import BigButton from './BigButton';
import IconButton, { IconSize } from './IconButton';

interface HeaderProps {
  openAccountModal: () => void
}

export default function Header({ openAccountModal }: HeaderProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const goTo = (path: string) => {
    setOpen(false);
    navigate(path);
  }

  function NavButton({ color, link, highlight = true, children }: { color: string, children: ReactNode, link: string, name: string, highlight?: boolean }) {
    const [hovered, setHovered] = useState(false);

    return <>
      <div
        onClick={() => goTo(link)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          color,
          backgroundColor: highlight && hovered ? `color-mix(in srgb, ${color} 12%, transparent)` : 'transparent',
        }}
        className="w-full cursor-pointer transition-colors"
      >
        <div className="gap-4 flex flex-row mx-4 py-4">
          {children}
        </div>
      </div>
    </>
  }

  function Divider() {
    return <hr className="mx-4 border-t border-primary" />
  }

  return (
    <>
      <header className="flex justify-between items-center px-6 h-15 border-b border-border">
        <div className="flex items-center gap-4">
          <IconButton icon={MenuIcon} color="var(--color-secondary)" size={IconSize.LARGE} onClick={() => setOpen(true)} />
          {/* <Link to="/" className="font-bold text-xl text-primary no-underline">JP</Link> */}
        </div>
        <IconButton icon={UserCircle} color="var(--color-primary)" size={IconSize.LARGE} onClick={() => openAccountModal()} />
      </header>

      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      />
      <nav
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[Canvas] shadow-lg flex flex-col gap-1 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <NavButton link="/" name="home" color="var(--color-primary)" highlight={false}>
          <img src="/favicon.svg" alt="icon" className="h-6 w-6"/>
          <p className="font-semibold">jasperpato</p>
        </NavButton>
        <Divider />
        <NavButton link="/play" name="play" color="var(--color-secondary)">
          <p className="font-semibold">Play!</p>
        </NavButton>
        <NavButton link="/board" name="board" color="var(--color-primary)">
          <p className="font-semibold">Board</p>
        </NavButton>
        <NavButton link="/add-words" name="add-words" color="var(--color-primary)">
          <p className="font-semibold">Add Words</p>
        </NavButton>
        <NavButton link="/feedback" name="feedback" color="var(--color-primary)">
          <p className="font-semibold">Feedback</p>
        </NavButton>
        {/* <Divider />
        <NavButton link="/resume" name="resume" color="var(--color-primary)">
          <p className="font-semibold">Resume</p>
        </NavButton> */}
      </nav>
    </>
  );
}
