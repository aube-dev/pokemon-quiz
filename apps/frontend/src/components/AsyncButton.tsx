import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

interface AsyncButtonProps extends Omit<
  React.ComponentProps<typeof Button>,
  "onClick"
> {
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => Promise<void>;
  loadingText?: string;
}

const AsyncButton = ({
  onClick,
  loadingText = "로딩 중...",
  children,
  disabled,
  ...props
}: AsyncButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      {...props}
      disabled={disabled || isLoading}
      onClick={
        onClick
          ? (e) => {
              setIsLoading(true);
              onClick?.(e).finally(() => {
                setIsLoading(false);
              });
            }
          : undefined
      }
    >
      {isLoading ? (
        <>
          <Spinner />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export { AsyncButton };
