'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Key, 
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { logout, getStoredUser } from '@/lib/auth';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Partners', href: '/dashboard/partners' },
  { icon: Package, label: 'Subscription Plans', href: '/dashboard/plans' },
  { icon: Key, label: 'Licenses', href: '/dashboard/licenses' },
  { icon: CreditCard, label: 'Payments', href: '/dashboard/payments' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = getStoredUser();
    setUser(userData);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isOpen ? 'w-64' : 'lg:w-20'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
<div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
  {/* Logo - Always visible, clickable to toggle */}
  <button
    onClick={() => setIsOpen(!isOpen)}
    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
  >
    <img
      src="/logo-horeka.svg"
      alt="Horeka POS+ Logo"
      className="h-8 w-8 flex-shrink-0"
    />
    {isOpen && (
      <div className="overflow-hidden">
        <h1 className="text-lg font-bold text-gray-900">Horeka POS+</h1>
      </div>
    )}
  </button>

  {/* ChevronLeft button - Only visible when sidebar is open */}
  {isOpen && (
    <button
      onClick={() => setIsOpen(false)}
      className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <ChevronLeft className="w-5 h-5 text-gray-600" />
    </button>
  )}
</div>    

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <li key={item.href}>
                    <button
                      onClick={() => router.push(item.href)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                        transition-all duration-200
                        ${isActive 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                        ${!isOpen && 'lg:justify-center'}
                      `}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                      {isOpen && (
                        <span className="font-medium text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                          {item.label}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile Section with Dropdown */}
          <div className="p-3 border-t border-gray-200 relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                hover:bg-gray-100 transition-colors
                ${!isOpen && 'lg:justify-center'}
              `}
            >
              {/* Avatar */}
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              
              {/* User Info (when sidebar is open) */}
              {isOpen && (
                <>
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.name || 'Admin'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.role || 'admin_platform'}
                    </p>
                  </div>
                  
                  {/* Three dots menu */}
                  <MoreVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </>
              )}
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div 
                className={`
                  absolute bottom-full mb-2 bg-white rounded-lg shadow-lg border border-gray-200
                  ${isOpen ? 'left-3 right-3' : 'left-3 w-48'}
                `}
              >
                <div className="py-2">
                  {/* Profile Option */}
                  <button
                    onClick={() => {
                      router.push('/dashboard/profile');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-gray-500" />
                    <span>Profile</span>
                  </button>

                  {/* Settings Option */}
                  <button
                    onClick={() => {
                      router.push('/dashboard/settings');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span>Settings</span>
                  </button>

                  {/* Divider */}
                  <div className="my-1 border-t border-gray-200"></div>

                  {/* Logout Option */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
