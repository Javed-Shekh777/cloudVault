// routes/SettingsRoutes.tsx
import { Outlet, NavLink } from 'react-router-dom';

export default function SettingsLayout() {
  const tabs = [
    { to: 'profile', label: 'Profile' },
    { to: 'security', label: 'Security' },
    { to: 'notifications', label: 'Notifications' },
    { to: 'storage', label: 'Storage & Billing' },
    { to: 'appearance', label: 'Appearance' },
    { to: 'privacy', label: 'Privacy' },
    { to: 'dev', label: 'Developer' },
    { to: 'danger', label: 'Danger zone' },
  ];
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="border-b mb-6 flex gap-4 overflow-x-auto">
        {tabs.map(t => (
          <NavLink key={t.to} to={t.to} className={({ isActive }) =>
            `px-3 py-2 rounded ${isActive ? 'bg-neutral-200 dark:bg-neutral-800' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'}`
          }>
            {t.label}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  );
}
