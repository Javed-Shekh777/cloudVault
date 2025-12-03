// features/settings/DangerTab.tsx
import DangerActions from './DangerActions';

export default function DangerTab() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
      <DangerActions />
    </section>
  );
}
