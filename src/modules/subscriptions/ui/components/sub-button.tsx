import { Button, ButtonProps } from "@ui/button";
import { cn } from "@utils/cn";

interface SubscriptionButtonProps {
  onClick: ButtonProps["onClick"];
  disabled: boolean;
  isSubscribed: boolean;
  classname?: string;
  size?: ButtonProps["size"];
}

export const SubscriptionButton = ({
  onClick,
  disabled,
  isSubscribed,
  classname,
  size,
}: SubscriptionButtonProps) => {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      size={size}
      variant={isSubscribed ? "secondary" : "default"}
      classname={cn("rounded-full", classname)}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
};
