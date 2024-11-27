import React, { forwardRef, useState, Fragment, ElementType, ReactNode, ForwardRefRenderFunction } from "react"
import { twMerge } from "tailwind-merge"
import { Transition } from "@headlessui/react"

type Variant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "pending"
  | "danger"
  | "dark"
  | "outline-primary"
  | "outline-secondary"
  | "outline-success"
  | "outline-warning"
  | "outline-pending"
  | "outline-danger"
  | "outline-dark"
  | "soft-primary"
  | "soft-secondary"
  | "soft-success"
  | "soft-warning"
  | "soft-pending"
  | "soft-danger"
  | "soft-dark";

type AlertProps = {
  as?: ElementType;
  children: ReactNode | ((props: { dismiss: () => void }) => JSX.Element);
  dismissible?: boolean;
  variant?: Variant;
  onShow?: () => void;
  onShown?: () => void;
  onHide?: () => void;
  onHidden?: () => void;
  className?: string;
};

type AlertRef = HTMLElement;

const AlertBase: ForwardRefRenderFunction<AlertRef, AlertProps> = (
  { as: Component = "div", dismissible, variant, children, className, ...props },
  ref
) => {
  const [show, setShow] = useState<boolean>(true);

  // Main Colors
  const primary = [
    "bg-primary border-primary text-white",
    "dark:border-primary",
  ];
  const secondary = [
    "bg-secondary/70 border-secondary/70 text-slate-500",
    "dark:border-darkmode-400 dark:bg-darkmode-400 dark:text-slate-300",
  ];
  const success = [
    "bg-success border-success text-slate-900",
    "dark:border-success",
  ];
  const warning = [
    "bg-warning border-warning text-slate-900",
    "dark:border-warning",
  ];
  const pending = [
    "bg-pending border-pending text-white",
    "dark:border-pending",
  ];
  const danger = [
    "bg-danger border-danger text-white",
    "dark:border-danger",
  ];
  const dark = [
    "bg-dark border-dark text-white",
    "dark:bg-darkmode-800 dark:border-transparent dark:text-slate-300",
  ];

  // Outline
  const outlinePrimary = [
    "border-primary text-primary",
    "dark:border-primary",
  ];
  const outlineSecondary = [
    "border-secondary text-slate-500",
    "dark:border-darkmode-100/40 dark:text-slate-300",
  ];
  const outlineSuccess = [
    "border-success text-success dark:border-success",
    "dark:border-success",
  ];
  const outlineWarning = [
    "border-warning text-warning",
    "dark:border-warning",
  ];
  const outlinePending = [
    "border-pending text-pending",
    "dark:border-pending",
  ];
  const outlineDanger = [
    "border-danger text-danger",
    "dark:border-danger",
  ];
  const outlineDark = [
    "border-dark text-dark",
    "dark:border-darkmode-800 dark:text-slate-300",
  ];

  // Soft Color
  const softPrimary = [
    "bg-primary border-primary bg-opacity-20 border-opacity-5 text-primary",
    "dark:border-opacity-100 dark:bg-opacity-20 dark:border-primary",
  ];
  const softSecondary = [
    "bg-slate-300 border-secondary bg-opacity-10 text-slate-500",
    "dark:bg-darkmode-100/20 dark:border-darkmode-100/30 dark:text-slate-300",
  ];
  const softSuccess = [
    "bg-success border-success bg-opacity-20 border-opacity-5 text-success",
    "dark:border-success dark:border-opacity-20",
  ];
  const softWarning = [
    "bg-warning border-warning bg-opacity-20 border-opacity-5 text-warning",
    "dark:border-warning dark:border-opacity-20",
  ];
  const softPending = [
    "bg-pending border-pending bg-opacity-20 border-opacity-5 text-pending",
    "dark:border-pending dark:border-opacity-20",
  ];
  const softDanger = [
    "bg-danger border-danger bg-opacity-20 border-opacity-5 text-danger",
    "dark:border-danger dark:border-opacity-20",
  ];
  const softDark = [
    "bg-dark border-dark bg-opacity-20 border-opacity-5 text-dark",
    "dark:bg-darkmode-800/30 dark:border-darkmode-800/60 dark:text-slate-300",
  ];

  return (
    <Transition
      as={Fragment}
      show={show}
      enter="transition-all ease-linear duration-150"
      enterFrom="invisible opacity-0 translate-y-1"
      enterTo="visible opacity-100 translate-y-0"
      leave="transition-all ease-linear duration-150"
      leaveFrom="visible opacity-100 translate-y-0"
      leaveTo="invisible opacity-0 translate-y-1"
    >
      <Component
        {...props}
        ref={ref}
        role="alert"
        className={twMerge([
          "relative border rounded-md px-5 py-4",
          variant == "primary" && primary,
          variant == "secondary" && secondary,
          variant == "success" && success,
          variant == "warning" && warning,
          variant == "pending" && pending,
          variant == "danger" && danger,
          variant == "dark" && dark,
          variant == "outline-primary" && outlinePrimary,
          variant == "outline-secondary" && outlineSecondary,
          variant == "outline-success" && outlineSuccess,
          variant == "outline-warning" && outlineWarning,
          variant == "outline-pending" && outlinePending,
          variant == "outline-danger" && outlineDanger,
          variant == "outline-dark" && outlineDark,
          variant == "soft-primary" && softPrimary,
          variant == "soft-secondary" && softSecondary,
          variant == "soft-success" && softSuccess,
          variant == "soft-warning" && softWarning,
          variant == "soft-pending" && softPending,
          variant == "soft-danger" && softDanger,
          variant == "soft-dark" && softDark,
          dismissible && "pl-5 pr-16",
          className,
        ])}
      >
        {typeof children === "function"
          ? children({
              dismiss: () => {
                setShow(false);
              },
            })
          : children}
      </Component>
    </Transition>
  );
};

const Alert = forwardRef<AlertRef, AlertProps>(AlertBase);

type DismissButtonProps<C extends React.ElementType = "button"> = {
  as?: C;
} & Omit<React.ComponentPropsWithoutRef<C>, 'as'>;

const DismissButton = <C extends React.ElementType = "button">({
  as,
  children,
  ...props
}: DismissButtonProps<C>) => {
  const Component = as || "button";

  return (
    <Component
      {...props}
      type="button"
      aria-label="Close"
      className={twMerge([
        "text-slate-800 py-2 px-3 absolute right-0 my-auto mr-2",
        props.className,
      ])}
    >
      {children}
    </Component>
  );
};

const AlertComponent = Object.assign(Alert, {
  DismissButton: DismissButton,
});

export default AlertComponent;