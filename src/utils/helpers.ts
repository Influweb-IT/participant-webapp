import { User } from "@influenzanet/case-web-app-core/build/api/types/user";

export function getMainProfileId(user: User) {
  return user.profiles.find((profile) => profile.mainProfile)?.id;
}
