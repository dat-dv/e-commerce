import { Button } from "@ecommerce/ui";
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
    <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-content text-xl font-black tracking-tight sm:text-2xl">
          {title}
        </h1>

        <p className="text-content/50 mt-1 text-sm break-words">
          {description}
        </p>
      </div>

      {showAction && (
        <Button
          className="flex w-full items-center justify-center gap-2 rounded-xl sm:w-auto sm:shrink-0"
          onPress={onPress}
        >
          <Plus size={16} />
          <span className="truncate">{actionLabel}</span>
        </Button>
      )}
    </div>
  );
};

export default AddressViewHeader;
