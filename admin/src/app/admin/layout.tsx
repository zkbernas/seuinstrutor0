'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileCheck,
  Users,
  CreditCard,
  DollarSign,
  BarChart3,
  Shield,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import styles from './admin.module.css';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'OPERATOR';
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAdmin(data.admin);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Carregando...</p>
      </div>
    );
  }

  if (!admin) return null;

  const menuItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/review', icon: FileCheck, label: 'Verificação' },
    { href: '/admin/instructors', icon: Users, label: 'Instrutores' },
    { href: '/admin/plans', icon: CreditCard, label: 'Planos', adminOnly: true },
    { href: '/admin/payments', icon: DollarSign, label: 'Pagamentos' },
    { href: '/admin/reports', icon: BarChart3, label: 'Relatórios' },
    { href: '/admin/audit', icon: Shield, label: 'Auditoria', adminOnly: true },
  ];

  const filteredMenu = menuItems.filter(
    (item) => !item.adminOnly || admin.role === 'ADMIN'
  );

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <h1>SeuInstrutor</h1>
          <button className={styles.closeSidebar} onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className={styles.nav}>
          {filteredMenu.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.adminInfo}>
            <div className={styles.adminAvatar}>
              {admin.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className={styles.adminName}>{admin.name}</p>
              <p className={styles.adminRole}>{admin.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={styles.main}>
        <header className={styles.header}>
          <button className={styles.menuButton} onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className={styles.headerRight}>
            <span className={styles.adminEmail}>{admin.email}</span>
          </div>
        </header>

        <main className={styles.content}>{children}</main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
