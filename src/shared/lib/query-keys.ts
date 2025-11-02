export const queryKeys = {
  userInfo: () => ['userInfo'] as const,
  teams: {
    all: (q?: string) => (q ? ['teams', q] : ['teams']),
    detail: (id: number) => ['teams', id],
  },
  coach: {
    studentMatches: (userId: string, from?: string, to?: string) => {
      if (from && to) {
        return ['coach', 'student-matches', userId, from, to] as const;
      }
      return ['coach', 'student-matches', userId] as const;
    },
  },
};

