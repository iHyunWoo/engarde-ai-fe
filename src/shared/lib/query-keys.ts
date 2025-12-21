export const queryKeys = {
  userInfo: () => ['userInfo'] as const,
  teams: {
    all: (q?: string) => (q ? ['teams', q] : ['teams']),
    detail: (id: number) => ['teams', id],
    deactivated: () => ['teams', 'deactivated'] as const,
  },
  coach: {
    studentMatches: (userId: string, from?: string, to?: string) => {
      if (from && to) {
        return ['coach', 'student-matches', userId, from, to] as const;
      }
      return ['coach', 'student-matches', userId] as const;
    },
    studentMatchDetail: (userId: string, matchId: string) =>
      ['coach', 'student-match-detail', userId, matchId] as const,
    studentMatchVideo: (objectName: string) =>
      ['coach', 'student-match-video', objectName] as const,
    studentMatchMarkings: (matchId: string | number) =>
      ['coach', 'student-match-markings', matchId] as const,
  },
  admin: {
    users: (search?: string) => (search ? ['admin', 'users', search] : ['admin', 'users']),
    deletedUsers: () => ['admin', 'deleted-users'] as const,
  },
  statistics: {
    v3: (from: string, to: string, mode: string) => ['statistics', 'v3', from, to, mode] as const,
    coachUserV3: (userId: string, from: string, to: string, mode: string) => ['statistics', 'coach-user-v3', userId, from, to, mode] as const,
  },
};
