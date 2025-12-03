// features/settings/StorageTab.tsx
import BillingInfo from './BillingInfo';
import StorageUsage from './StorageUsage';

export default function StorageTab() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Storage & Billing</h2>
      <StorageUsage />
      <BillingInfo />
    </section>
  );
}
