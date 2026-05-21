import { useCallback, useState } from "react";

export function useToggle(defaultValue = false) {
  const [open, setOpen] = useState(defaultValue);

  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    open,
    setOpen,
    toggle,
    onOpen,
    onClose,
  };
}
