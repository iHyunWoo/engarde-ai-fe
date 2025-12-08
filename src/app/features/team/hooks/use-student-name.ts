import { useQuery } from '@tanstack/react-query';
import { useTeamStudentsInfinite } from './use-team-students-infinite';

export function useStudentName(userId: string | number) {
  const { students } = useTeamStudentsInfinite();
  const student = students.find((s) => s.id === Number(userId));

  return {
    name: student?.name,
    email: student?.email,
    isLoading: false,
  };
}

