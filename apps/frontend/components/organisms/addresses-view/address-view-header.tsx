import Button from "@/components/atoms/button";
import { Plus } from "lucide-react";

const AddressViewHeader = ({
  title,
  description,
  actionLabel,
  onPress,
  showAction = true,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onPress: () => void;
  showAction?: boolean;
}) => {
  return (
    <div className="flex flex-wrap justify-between items-start gap-3">
      <div>
        <h1 className="text-2xl font-black text-content tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-content/50 mt-1">{description}</p>
      </div>
      {showAction && (
        <Button
          className="flex items-center gap-2 rounded-xl"
          onPress={onPress}
        >
          <Plus size={16} />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default AddressViewHeader;
