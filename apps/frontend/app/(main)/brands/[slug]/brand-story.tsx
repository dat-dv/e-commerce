import { TBrand } from "@/domain/homepage/types/homepage.model";
import { Quote } from "lucide-react";

interface BrandStoryProps {
  brand: TBrand;
}

export function BrandStory({ brand }: BrandStoryProps) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
      {/* Title Side */}
      <div className="lg:col-span-5 flex flex-col gap-8 sticky top-32">
        <div className="flex items-center gap-4">
          <div className="h-[1px] w-12 bg-primary" />
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">The Heritage</span>
        </div>
        
        <h2 className="text-6xl font-black tracking-tighter text-content leading-[0.9] uppercase italic">
          Crafting <br />
          <span className="text-primary">Tomorrow</span>
        </h2>

        <div className="p-8 bg-content/[0.03] rounded-[2rem] border border-content/5 relative overflow-hidden">
          <Quote className="absolute -top-4 -left-4 w-24 h-24 text-primary opacity-5" />
          <p className="relative z-10 text-xl font-light italic text-content/60 leading-relaxed">
            "{brand.description || `Leading the industry with innovation and world-class design standards.`}"
          </p>
        </div>
      </div>

      {/* Content Side */}
      <div className="lg:col-span-7 flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Overview</span>
              <p className="text-content/70 leading-relaxed font-medium">
                Established with a vision to redefine the boundaries of technology and lifestyle, 
                {brand.name} has consistently delivered excellence across its global portfolio.
              </p>
           </div>
           <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Philosophy</span>
              <p className="text-content/70 leading-relaxed font-medium">
                At the core of {brand.name} lies a commitment to precision engineering and 
                a deep understanding of the modern consumer's evolving needs.
              </p>
           </div>
        </div>

        <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-content/10">
           <img 
             src={brand.banner_url || "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"} 
             className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
             alt="Philosophy image"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
           <div className="absolute bottom-8 left-8">
              <span className="text-4xl font-black text-content uppercase tracking-tighter">Iconic Series</span>
           </div>
        </div>

        <div className="flex flex-col gap-6">
           <p className="text-content/60 text-lg leading-relaxed">
             From its humble beginnings to its current status as a global leader, {brand.name} 
             continues to push the limits of what's possible, merging aesthetics with high-performance 
             functionality in every product they create.
           </p>
        </div>
      </div>
    </section>
  );
}
