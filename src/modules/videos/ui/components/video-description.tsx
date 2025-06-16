import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoDescriptionProps {
  description?: string | null;
  compactViews: string;
  expandViews: string;
  compactDate: string;
  expandDate: string;
}

export const VideoDescription = ({
  description,
  compactViews,
  expandViews,
  compactDate,
  expandDate,
}: VideoDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div
      className="bg-secondary/50 rounded-xl p-3 cursor-pointer transition hover:bg-secondary/70"
      onClick={() => setIsExpanded((current) => !current)}
    >
      <div className="flex gap-2 mb-2 text-sm">
        <span className="font-medium">
          {isExpanded ? expandViews : compactViews} views
        </span>
        <span className="flex gap-2 mb-2 te">
          {isExpanded ? expandDate : compactDate}
        </span>
      </div>
      <div className="relative">
        <p
          className={cn(
            "text-sm whitespace-pre-wrap",
            !isExpanded && "line-clamp-3"
          )}
        >
          {description || "This video has no description."}
        </p>
        <div className="flex font-medium text-sm items-center gap-1 mt-4">
            {isExpanded ? (
                <>
                    Show less
                    <ChevronUpIcon className="size-4" />
                </>
            ) : (
                <>
                    Show more
                    <ChevronDownIcon className="size-4" />
                </>
            )}
        </div>
      </div>
    </div>
  );
};
