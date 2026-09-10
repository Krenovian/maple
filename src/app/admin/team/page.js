import prisma from '@/lib/prisma';
import TeamMembersManager from '@/components/admin/TeamMembersManager';

export const metadata = { title: 'Team Profiles | Admin Workspace' };

export default async function AdminTeamPage() {
  const members = await prisma.teamMember.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });

  const payload = members.map((member) => ({
    ...member,
    createdAt: member.createdAt.toISOString(),
    updatedAt: member.updatedAt.toISOString(),
  }));

  return <TeamMembersManager initialMembers={payload} />;
}
