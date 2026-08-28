import ShopSettingsManager from '@/components/admin/ShopSettingsManager';
import { getShopSettings } from '@/lib/shopSettings';

export const metadata = { title: 'Shop Settings | Admin Workspace' };

export default async function AdminShopPage() {
  const settings = await getShopSettings();
  return <ShopSettingsManager initialSettings={settings} />;
}
