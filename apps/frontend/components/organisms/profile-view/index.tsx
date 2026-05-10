import { AnimationContainer } from "@/components/atoms/animate";
import AppContainer from "@/components/atoms/app-container";

import { ProfileForm } from "../../molecules/profile-form";

export const ProfileView = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] pt-20 bg-gradient-to-b from-surface to-transparent">
      <AppContainer size="md">
        <AnimationContainer className="space-y-12">
          <ProfileForm />
        </AnimationContainer>
      </AppContainer>
    </div>
  );
};
