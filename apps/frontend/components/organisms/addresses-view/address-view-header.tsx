import Button from "@/components/atoms/button";
import { Plus } from "lucide-react";

interface AddressViewHeaderProps {
  title: string;
  description: string;
  actionLabel: string;
  onPress: () => void;
  showAction?: boolean;
}

const AddressViewHeader = ({
  title,
  description,
  actionLabel,
  onPress,
  showAction = true,
}: AddressViewHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-black tracking-tight text-content sm:text-2xl">
          {title}
        </h1>

        <p className="mt-1 text-sm text-content/50">{description}</p>
      </div>

      {showAction && (
        <Button
          className="flex w-full items-center justify-center gap-2 rounded-xl sm:w-auto sm:shrink-0"
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
