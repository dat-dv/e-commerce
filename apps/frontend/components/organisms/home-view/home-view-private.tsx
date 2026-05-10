import { AnimationContainer, AnimationItem } from '@/components/atoms/animate';
import Button from '@/components/atoms/button';
import { HomeLiveStateMonitor } from '@/components/organisms/home-view/home-live-state-monitor';
import { APP_ROUTES } from '@/constants/routes';

export const HomepagePrivate = () => {
  return (
    <div
      data-testid="private-home"
      className="flex flex-col pt-20 items-center px-6 min-h-[calc(100vh-80px)]"
    >
      <AnimationContainer className="max-w-xl w-full flex flex-col gap-10 text-center items-center">
        <AnimationItem className="space-y-4">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight">
            Manage <span className="text-primary italic font-serif">Your Tasks.</span>
          </h1>
          <p className="text-lg opacity-70 leading-relaxed font-medium">
            Take control of your workflow and stay productive with our lightweight task list.
          </p>
        </AnimationItem>

        <HomeLiveStateMonitor />

        <AnimationItem className="pt-4 pb-10">
          <Button
            href={APP_ROUTES.TODO}
            variant="primary"
            size="lg"
            className="rounded-2xl px-12 text-base font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          >
            Open My Workspace
          </Button>
        </AnimationItem>
      </AnimationContainer>
    </div>
  );
};
