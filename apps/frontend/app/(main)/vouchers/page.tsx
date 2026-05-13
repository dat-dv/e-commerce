import AppContainer from "@/components/atoms/app-container";
import { Ticket } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kho Voucher | E-Commerce",
  description: "Lưu ngay mã giảm giá, Freeship và hoàn tiền",
};

export default function VouchersPage() {
  return (
    <AppContainer className="py-12">
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-6">
        <div className="w-20 h-20 rounded-full bg-pink-500/10 flex items-center justify-center hover:scale-110 transition-transform duration-300">
          <Ticket className="w-10 h-10 text-pink-500" />
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Kho Voucher & Ưu Đãi
        </h1>

        <p className="text-content/60 max-w-lg mx-auto">
          Thu thập mã giảm giá, mã Freeship và voucher từ các thương hiệu hàng
          đầu. Mọi thứ đã sẵn sàng cho giỏ hàng của bạn.
        </p>

        {/* Placeholder for Vouchers List */}
        <div className="w-full max-w-4xl mt-8 p-8 rounded-3xl bg-content/[0.02] border border-content/[0.05] backdrop-blur-md">
          <h2 className="text-xl font-semibold mb-4 text-content/40">
            Danh sách mã giảm giá (Coming Soon)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-content/[0.03] flex items-center p-6 gap-4 border border-content/[0.05] hover:border-pink-500/30 transition-colors"
              >
                <div className="w-20 h-20 rounded-xl bg-content/[0.05] animate-pulse" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-content/[0.05] rounded-full w-3/4 animate-pulse" />
                  <div className="h-3 bg-content/[0.05] rounded-full w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppContainer>
  );
}
