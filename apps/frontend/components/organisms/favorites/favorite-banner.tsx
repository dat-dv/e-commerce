import { motion } from "framer-motion";

const FavoritesBanner = ({ count }: { count: number }) => (
  <div className="relative overflow-hidden bg-transparent border-b border-content/[0.03]">
    {/* Subtle background decoration */}
    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

    <div className="container mx-auto px-4 py-20 max-w-7xl relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-content tracking-tighter leading-none">
            Wishlist
          </h1>
          <p className="text-content/40 font-medium max-w-md text-lg">
            A curated selection of items you&apos;ve fallen in love with. Ready
            to make them yours?
          </p>
        </div>

        <div className="flex items-center gap-8 py-2 md:py-0">
          <div className="flex flex-col">
            <span className="text-3xl font-black text-content">{count}</span>
            <span className="text-xs uppercase tracking-widest font-bold text-content/30">
              Total Items
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);

export default FavoritesBanner;
