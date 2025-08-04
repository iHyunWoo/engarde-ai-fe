import {login} from "@/app/features/auth/api/login";
import {useUserStore} from "@/shared/hooks/use-user-store";
import {User} from "@/entities/user";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

export function useLogin() {
  const { setUser } = useUserStore();
  const router = useRouter();

  const handleLogin = async (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => {
    const res = await login({ email, password, rememberMe });

    if (!res) {
      toast('Unknown error');
      return;
    }

    if (res.code !== 200 || !res.data) {
      toast(res.message);
      return;
    }

    const { userId, name } = res.data;

    const user: User = { id: userId, email, name };
    setUser(user);
    router.push('/matches');
  };

  return { handleLogin };
}