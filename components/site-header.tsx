'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconMenu2, IconX } from '@tabler/icons-react';

const mainLinks = [
  { href: '/hanh-trinh', label: 'Hành trình' },
  { href: '/du-thuyen', label: 'Du thuyền' },
  { href: '/lien-he', label: 'Liên hệ' },
];

const contestLinks = [
  { href: '/wall', label: 'Danh sách dự thi' },
  { href: '/results', label: 'Kết quả' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setIsOpen(false);
  }

  return (
    <header className="site-header" aria-label="Điều hướng cuộc thi slogan Green Ruby">
      <div className="page-frame nav-edge">
        <Link href="/" className="wordmark">
          <Image src="/slogan/logo-negative.png" alt="" width={117} height={93} className="wordmark-logo" priority />
          Green Ruby
        </Link>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={isOpen}
          aria-controls="site-nav-menu"
          aria-label={isOpen ? 'Đóng menu' : 'Mở menu'}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <IconX size={22} aria-hidden="true" /> : <IconMenu2 size={22} aria-hidden="true" />}
        </button>
        <nav className="site-nav" id="site-nav-menu" aria-label="Menu chính" data-open={isOpen}>
          {mainLinks.map((link) => (
            <a className="nav-link" href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
          <span className="nav-divider" aria-hidden="true" />
          {contestLinks.map((link) => (
            <Link className="nav-link" href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
