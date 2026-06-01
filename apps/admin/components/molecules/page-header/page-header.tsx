import { Button } from "@ecommerce/ui";
import { ArrowLeft } from "lucide-react";

export interface PageHeaderProps {
  title: string;
  description?: string;
  backAction?: () => void;
  /** Accessibility label for the back button */
  backLabel?: string;
  /** Optional content to render on the right side of the header */
  children?: React.ReactNode;
}

export const PageHeader = ({
  title,
  description,
  backAction,
  backLabel = "Go back",
  children,
}: PageHeaderProps) => {
  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {backAction && (
          <Button
            variant="ghost"
            size="icon"
            onClick={backAction}
            className="text-content hover:bg-primary/10 hover:text-primary rounded-lg"
            aria-label={backLabel}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}

        <div className="min-w-0">
          <h1 className="text-content text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="text-content/55 mt-1 text-sm">{description}</p>
          )}
        </div>
      </div>
      {children && <div>{children}</div>}
    </div>
  );
};
