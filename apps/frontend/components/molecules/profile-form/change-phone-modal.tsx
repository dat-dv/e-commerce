"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Button from "@/components/atoms/button";
import { XIcon } from "@/components/atoms/icons";
import { useState, useEffect } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { FormPhoneInput } from "@/components/molecules/form/form-phone-input";

interface ChangePhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPhone: string) => void;
  currentPhone: string;
}

export default function ChangePhoneModal({
  isOpen,
  onClose,
  onSuccess,
  currentPhone,
}: ChangePhoneModalProps) {
  const [step, setStep] = useState(currentPhone ? 1 : 2);
  const [otpCode, setOtpCode] = useState("");
  const [newOtpCode, setNewOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const methods = useForm({
    defaultValues: {
      newPhoneNumber: "",
    },
  });

  const newPhone = useWatch({
    control: methods.control,
    name: "newPhoneNumber",
  });

  const handleClose = () => {
    setStep(currentPhone ? 1 : 2);
    setOtpCode("");
    setNewOtpCode("");
    setCountdown(0);
    methods.reset({ newPhoneNumber: "" });
    onClose();
  };

  const handleSendOtpOld = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setCountdown(60);
      alert(`[SIMULATOR] OTP sent to ${currentPhone}: 123456`);
      // In a real app, this would call your API to send SMS
    }, 1000);
  };

  const handleVerifyOtpOld = async () => {
    if (otpCode !== "123456") {
      alert("Invalid OTP. Try 123456");
      return;
    }
    setStep(2);
    setOtpCode("");
    setCountdown(0);
  };

  const handleSendOtpNew = async () => {
    if (!newPhone) {
      alert("Please enter a phone number");
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setCountdown(60);
      alert(`[SIMULATOR] OTP sent to ${newPhone}: 654321`);
    }, 1000);
  };

  const handleVerifyOtpNew = async () => {
    if (newOtpCode !== "654321") {
      alert("Invalid OTP. Try 654321");
      return;
    }
    onSuccess(newPhone);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-[9999]">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto max-w-md w-full rounded-2xl bg-surface p-6 shadow-2xl border border-content/5">
          <div className="flex justify-between items-center mb-6">
            <DialogTitle className="text-xl font-bold text-content">
              {step === 1 ? "Verify Current Phone" : "Verify New Phone"}
            </DialogTitle>
            <button
              onClick={handleClose}
              className="text-content/50 hover:text-content"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          {step === 1 ? (
            <div className="space-y-4">
              <p className="text-sm text-content/70">
                To change your phone number, we need to verify your current
                number: <strong className="text-content">{currentPhone}</strong>
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="flex-1 h-10 border border-content/10 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-surface/50"
                  maxLength={6}
                />
                <Button
                  onClick={handleSendOtpOld}
                  disabled={loading || countdown > 0}
                  variant="outline"
                  className="h-10 text-sm whitespace-nowrap"
                >
                  {countdown > 0 ? `Resend (${countdown}s)` : "Send OTP"}
                </Button>
              </div>
              <Button
                onClick={handleVerifyOtpOld}
                disabled={otpCode.length < 6}
                variant="primary"
                className="w-full h-10 text-sm rounded-xl"
              >
                Next
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-content/70">
                Enter your new phone number and verify it.
              </p>
              <FormProvider {...methods}>
                <FormPhoneInput
                  name="newPhoneNumber"
                  placeholder="Your New Phone Number"
                  className="h-10 text-sm rounded-xl"
                />
              </FormProvider>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={newOtpCode}
                  onChange={(e) => setNewOtpCode(e.target.value)}
                  className="flex-1 h-10 border border-content/10 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-surface/50"
                  maxLength={6}
                />
                <Button
                  onClick={handleSendOtpNew}
                  disabled={loading || countdown > 0 || !newPhone}
                  variant="outline"
                  className="h-10 text-sm whitespace-nowrap"
                >
                  {countdown > 0 ? `Resend (${countdown}s)` : "Send OTP"}
                </Button>
              </div>
              <Button
                onClick={handleVerifyOtpNew}
                disabled={newOtpCode.length < 6 || !newPhone}
                variant="primary"
                className="w-full h-10 text-sm rounded-xl"
              >
                Confirm Change
              </Button>
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
