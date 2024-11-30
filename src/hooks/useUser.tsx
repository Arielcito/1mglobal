//create a hook to get the user from the session

import { useSession } from "next-auth/react";

export const useUser = () => {
  const { data: session } = useSession();
  return session?.user;
};