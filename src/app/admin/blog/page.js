import prisma from '@/lib/prisma';
import PostsManager from '@/components/admin/PostsManager';

export const metadata = { title: 'Blog | Admin Workspace' };

export default async function AdminBlogPage() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });

  const payload = posts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    publishedAt: post.publishedAt?.toISOString() || null,
  }));

  return <PostsManager initialPosts={payload} />;
}
