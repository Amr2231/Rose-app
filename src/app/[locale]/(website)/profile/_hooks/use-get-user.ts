import { useQuery } from "@tanstack/react-query";
import { getLoggedUserService } from "../_services/user.service";

export function useGetUser() {
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: getLoggedUserService,
  });

  return { user: data };
}
