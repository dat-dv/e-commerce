import { AnimationContainer, AnimationItem } from "@/components/atoms/animate";
import AppContainer from "@/components/atoms/app-container";
import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";

const HomepagePublic = () => {
  return (
    <AppContainer
      data-testid="public-home"
      size="sm"
      className="flex flex-col pt-20 items-center text-center min-h-[calc(100vh-80px)] px-0 sm:px-0 lg:px-0"
    >
      <AnimationContainer className="flex flex-col gap-8 items-center">
        <AnimationItem className="space-y-4">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight">
            Discover <span className="text-primary italic font-serif">&</span>{" "}
            Shop.
          </h1>
          <p className="text-lg opacity-70 leading-relaxed font-medium">
            Explore our curated collection of minimalist and high-performance
            products.
          </p>
        </AnimationItem>

        <AnimationItem className="pt-4">
          <Button
            href={APP_ROUTES.SIGN_IN}
            variant="outline"
            size="lg"
            className="rounded-2xl px-12 text-base font-bold shadow-lg shadow-primary/10 transition-all hover:scale-105 active:scale-95"
          >
            Start Shopping
          </Button>
        </AnimationItem>

      </AnimationContainer>
    </AppContainer>
  );
};

export default HomepagePublic;
