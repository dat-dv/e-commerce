import AppContainer from "@/components/atoms/app-container";
import { Zap } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flash Sale | E-Commerce",
  description: "Grab the best deals before they are gone!",
};

export default function FlashSalePage() {
  return (
    <AppContainer className="py-12">
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-6">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center animate-pulse">
          <Zap className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          Flash Sale đang diễn ra!
        </h1>

        <p className="text-content/60 max-w-lg mx-auto">
          Các siêu phẩm với giá hủy diệt sẽ sớm được cập nhật tại đây. Hãy chuẩn
          bị sẵn sàng để săn những deal đỉnh nhất với số lượng giới hạn.
        </p>

        {/* Placeholder for Countdown Timer and Product Grid */}
        <div className="w-full max-w-4xl mt-8 p-8 rounded-3xl bg-content/[0.02] border border-content/[0.05] backdrop-blur-md">
          <h2 className="text-xl font-semibold mb-4 text-content/40">
            Khu vực săn Deal (Coming Soon)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-2xl bg-content/[0.03] animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </AppContainer>
  );
}
