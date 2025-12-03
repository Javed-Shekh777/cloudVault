// features/settings/SecurityTab.tsx
import SecurityDevices from './SecurityDevices';
import ChangePasswordForm from './ChangePasswordForm';
import TwoFASection from './TwoFASection';

export default function SecurityTab() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Security</h2>
      <ChangePasswordForm />
      <TwoFASection />
      <SecurityDevices />
    </section>
  );
}
