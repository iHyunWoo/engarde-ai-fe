export const queryKeys = {
  userInfo: () => ['userInfo'] as const,
  teams: {
    all: (q?: string) => (q ? ['teams', q] : ['teams']),
    detail: (id: number) => ['teams', id],
  },
};

