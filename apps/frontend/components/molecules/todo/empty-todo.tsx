import { motion } from "framer-motion";
import { memo } from "react";

const EmptyTodo = memo(() => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center py-20 grayscale opacity-40 gap-4"
    >
      <div className="text-6xl">✨</div>
      <p className="font-bold text-lg">No tasks found in this view</p>
    </motion.div>
  );
});

EmptyTodo.displayName = "EmptyTodo";

export default EmptyTodo;
