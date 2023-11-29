import { Profile } from "@influenzanet/case-web-app-core/build/api/types/user";

export function getMainProfileId(profiles: Profile[]) {
  return profiles.find((profile) => profile.mainProfile)?.id;
}
