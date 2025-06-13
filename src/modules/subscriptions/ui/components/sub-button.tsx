import { Button, ButtonProps } from "@ui/button";
import { cn } from "@utils/cn";

interface SubButtonProps {
  onClick: ButtonProps["onClick"];
  disabled: boolean;
  isSubscribed: boolean;
  classname?: string;
  size?: ButtonProps["size"];
}

export const SubButton = ({
  onClick,
  disabled,
  isSubscribed,
  classname,
  size,
}: SubButtonProps) => {
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
