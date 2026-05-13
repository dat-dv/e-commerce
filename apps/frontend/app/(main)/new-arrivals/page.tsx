import AppContainer from "@/components/atoms/app-container";
import { Sparkles } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hàng Mới Về | E-Commerce",
  description:
    "Khám phá những sản phẩm mới nhất vừa cập bến tại cửa hàng chúng tôi.",
};

export default function NewArrivalsPage() {
  return (
    <AppContainer className="py-12">
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-6">
        <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center animate-bounce">
          <Sparkles className="w-10 h-10 text-purple-500" />
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          Hàng Mới Cập Bến!
        </h1>

        <p className="text-content/60 max-w-lg mx-auto italic font-medium">
          "Luôn cập nhật những xu hướng mới nhất dành riêng cho bạn."
        </p>

        <p className="text-content/60 max-w-lg mx-auto">
          Danh sách sản phẩm mới nhất đang được chúng tôi chọn lọc và sẽ xuất
          hiện tại đây trong giây lát. Hãy quay lại thường xuyên để không bỏ lỡ
          những siêu phẩm vừa ra mắt!
        </p>

        <div className="w-full max-w-5xl mt-12">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-content/5">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Sản phẩm mới nhất
            </h2>
            <div className="text-sm text-content/40">Cập nhật hàng ngày</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="group relative flex flex-col gap-3">
                <div className="aspect-[3/4] rounded-3xl bg-content/[0.03] animate-pulse overflow-hidden relative border border-content/[0.05]">
                  <div className="absolute top-3 left-3 px-3 py-1 bg-purple-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider z-10">
                    New
                  </div>
                </div>
                <div className="h-4 w-3/4 bg-content/[0.05] rounded-full animate-pulse" />
                <div className="h-4 w-1/2 bg-content/[0.05] rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppContainer>
  );
}
