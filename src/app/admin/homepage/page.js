import HomepageContentManager from '@/components/admin/HomepageContentManager';
import { getHomepageContentRaw } from '@/lib/siteContent';

export const metadata = { title: 'Homepage Content | Admin Workspace' };

export default async function AdminHomepageContentPage() {
  const content = await getHomepageContentRaw();
  return <HomepageContentManager initialContent={content} />;
}
