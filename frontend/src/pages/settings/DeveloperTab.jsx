// features/settings/DeveloperTab.tsx
import TokensList from './TokensList';
import WebhooksSection from './WebhooksSection';

export default function DeveloperTab() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Developer Access</h2>
      <TokensList />
      <WebhooksSection />
    </section>
  );
}
