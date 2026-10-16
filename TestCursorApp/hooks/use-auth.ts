import { authService } from '@/services/auth-service';
import { useAuthStore } from '@/store/auth-store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      setSession(response.data);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: authService.register,
  });
}

export function useProfile() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: authService.getProfile,
    enabled: Boolean(token),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    authService.logout();
    queryClient.clear();
  };
}
