"use client";

import React from "react";

interface PrivacyContentProps {
  isVi: boolean;
}

export function PrivacyContent({
  isVi,
}: PrivacyContentProps): React.ReactElement {
  if (isVi) {
    return (
      <div className="space-y-12 text-content/80 leading-relaxed text-sm sm:text-base">
        <section id="introduction" className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-content mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full"></span>
            1. GIỚI THIỆU
          </h2>
          <div className="space-y-3">
            <p>
              1.1. Chào mừng bạn đến với nền tảng Shop.Hub (bao gồm website và
              ứng dụng di động) được vận hành bởi Shop.Hub và các công ty liên
              kết. Shop.Hub thực hiện nghiêm túc trách nhiệm của mình liên quan
              đến bảo mật thông tin theo các quy định về bảo vệ quyền riêng tư
              thông tin cá nhân của pháp luật và cam kết tôn trọng quyền riêng
              tư cũng như mối quan tâm của tất cả người dùng.
            </p>
            <p>
              {`1.2. "Dữ liệu cá nhân" hoặc "dữ liệu cá nhân" có nghĩa là dữ liệu,
              dù đúng hay không đúng, về một cá nhân có thể được nhận dạng từ dữ
              liệu đó, hoặc từ dữ liệu đó và thông tin khác mà một tổ chức có
              hoặc có khả năng tiếp cận.`}
            </p>
            <p>
              1.3. Bằng việc sử dụng Dịch vụ, đăng ký tài khoản với chúng tôi,
              hoặc truy cập Nền tảng, bạn xác nhận và đồng ý rằng bạn chấp nhận
              các phương pháp, yêu cầu và/hoặc chính sách được mô tả trong Chính
              sách Bảo mật này.
            </p>
          </div>
        </section>

        <section id="when-collect" className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-content mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full"></span>
            2. KHI NÀO CHÚNG TÔI THU THẬP DỮ LIỆU?
          </h2>
          <div className="space-y-3">
            <p>2.1. Chúng tôi sẽ/có thể thu thập dữ liệu cá nhân về bạn:</p>
            <ul className="list-disc pl-5 space-y-1 text-content/70">
              <li>
                Khi bạn đăng ký và/hoặc sử dụng Dịch vụ hoặc Nền tảng của chúng
                tôi, hoặc mở tài khoản với chúng tôi;
              </li>
              <li>
                Khi bạn nộp bất kỳ biểu mẫu nào, bao gồm đơn đăng ký hoặc các
                biểu mẫu khác liên quan đến bất kỳ sản phẩm và dịch vụ nào của
                chúng tôi;
              </li>
              <li>
                Khi bạn ký kết bất kỳ thỏa thuận nào hoặc cung cấp các tài liệu
                hoặc thông tin khác liên quan đến tương tác của bạn với chúng
                tôi.
              </li>
            </ul>
          </div>
        </section>

        <section id="what-collect" className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-content mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full"></span>
            3. DỮ LIỆU GÌ CHÚNG TÔI SẼ THU THẬP?
          </h2>
          <div className="space-y-3">
            <p>
              3.1. Dữ liệu cá nhân mà Shop.Hub có thể thu thập bao gồm dữ liệu
              cá nhân cơ bản và dữ liệu cá nhân nhạy cảm như: họ tên, địa chỉ
              email, ngày sinh, địa chỉ thanh toán/giao hàng, tài khoản ngân
              hàng và thông tin thanh toán, số điện thoại, giới tính và thông
              tin thiết bị.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-12 text-content/80 leading-relaxed text-sm sm:text-base">
      <section id="introduction" className="scroll-mt-24">
        <h2 className="text-2xl font-bold text-content mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full"></span>
          1. INTRODUCTION
        </h2>
        <div className="space-y-3">
          <p>
            1.1. Welcome to the Shop.Hub platform (including website and mobile
            application) operated by Shop.Hub and its affiliates. Shop.Hub takes
            its responsibilities regarding information security seriously in
            accordance with the regulations on the protection of personal
            information privacy by law and is committed to respecting the
            privacy and concerns of all users.
          </p>
          <p>
            1.2. &quot;Personal Data&quot; or &quot;personal data&quot; means
            data, whether true or not, about an individual who can be identified
            from that data, or from that data and other information to which an
            organization has or is likely to have access.
          </p>
          <p>
            1.3. By using the Services, registering an account with us, or
            accessing the Platform, you acknowledge and agree that you accept
            the methods, requirements, and/or policies described in this Privacy
            Policy.
          </p>
        </div>
      </section>

      <section id="when-collect" className="scroll-mt-24">
        <h2 className="text-2xl font-bold text-content mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full"></span>
          2. WHEN WILL WE COLLECT DATA?
        </h2>
        <div className="space-y-3">
          <p>2.1. We will/may collect personal data about you:</p>
          <ul className="list-disc pl-5 space-y-1 text-content/70">
            <li>
              When you register and/or use our Services or Platform, or open an
              account with us;
            </li>
            <li>
              When you submit any form, including application forms or other
              forms related to any of our products and services;
            </li>
            <li>
              When you enter into any agreement or provide other documents or
              information related to your interaction with us.
            </li>
          </ul>
        </div>
      </section>

      <section id="what-collect" className="scroll-mt-24">
        <h2 className="text-2xl font-bold text-content mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full"></span>
          3. WHAT DATA WILL WE COLLECT?
        </h2>
        <div className="space-y-3">
          <p>
            3.1. The personal data that Shop.Hub may collect includes basic
            personal data and sensitive personal data such as: name, email
            address, date of birth, billing/shipping address, bank account and
            payment information, phone number, gender, and device information.
          </p>
        </div>
      </section>
    </div>
  );
}

export default PrivacyContent;
