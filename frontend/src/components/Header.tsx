import { Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { useState } from 'react';

interface MenuItem {
  name: string,
  onClick: () => void
}

interface HeaderProps {
  onAccountClick: () => void
  // menuItems: Array<MenuItem>
}

export default function Header({ onAccountClick /* menuItems */ }: HeaderProps) {
  // const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <header className="flex justify-between items-center px-6 h-15 border-b border-border">
      <Link to="/" className="font-bold text-xl text-primary no-underline">JP</Link>
      <button onClick={onAccountClick} className="cursor-pointer bg-transparent border-none flex items-center text-secondary">
        <UserCircle size={28} />
      </button>
    </header>
  );
}
