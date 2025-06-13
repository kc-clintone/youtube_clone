const UserInfoVariants = cva("flex items-center gap-1", {
  variants: {
    size: {
      default: "[&_p]:text-sm [&_svg]:size-4",
      lg: "[&_p]:text-base [&_svg]:size-5 [&_p]:font-medium [&_p]:text-black",
      sm: "[&_p]:text-xs [&_svg]:size-3",
    },
  },
  defaultVariants: {
    size: "default",
  },
});
