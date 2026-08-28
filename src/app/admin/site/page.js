import SiteImagesManager from '@/components/admin/SiteImagesManager';
import { getSiteImages } from '@/lib/siteSettings';

export const metadata = { title: 'Site Images | Admin Workspace' };

export default async function AdminSitePage() {
  const images = await getSiteImages();

  return <SiteImagesManager initialImages={images} />;
}
