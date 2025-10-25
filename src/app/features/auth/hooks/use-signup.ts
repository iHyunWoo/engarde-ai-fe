import {signup} from "@/app/features/auth/api/signup";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

export function useSignup() {
  const router = useRouter();

  const handleSignup = async (
    email: string,
    password: string,
    name: string,
    confirmPassword: string,
    inviteCode: string,
  ) => {
    // 비밀번호 확인
    if (password !== confirmPassword) {
      toast('Passwords do not match');
      return;
    }

    // 비밀번호 길이 체크
    if (password.length < 6) {
      toast('Password must be at least 6 characters');
      return;
    }

    const res = await signup({ email, password, name });

    if (!res) {
      toast('Unknown error');
      return;
    }

    if (res.code !== 200) {
      toast(res.message);
      return;
    }

    toast('Account created successfully! Please log in.');
    router.push('/login');
  };

  return { handleSignup };
}
