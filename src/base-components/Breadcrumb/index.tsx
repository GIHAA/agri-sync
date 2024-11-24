/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/function-component-definition */
/* eslint-disable react/display-name */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable object-shorthand */
/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable react/require-default-props */
/* eslint-disable prettier/prettier */
import clsx from "clsx";
// eslint-disable-next-line prettier/prettier
import { Link } from "react-router-dom";
import { createContext, useContext } from "react";

interface BreadcrumbProps
  extends React.PropsWithChildren,
    React.ComponentPropsWithoutRef<"nav"> {
  light?: boolean;
  children: React.ReactElement | React.ReactElement[];
}

const breadcrumbContext = createContext<{
  light?: boolean;
}>({
  light: undefined,
});

function Breadcrumb({ className, light, children }: BreadcrumbProps) {
  return (
    <breadcrumbContext.Provider
      value={{
        light: light,
      }}
    >
      <nav className={clsx(["flex", className])} aria-label="breadcrumb">
        <ol
          className={clsx([
            "flex items-center text-primary dark:text-slate-300",
            { "text-white/90": light },
          ])}
        >
          {Array.isArray(children)
            ? children.map((item, key) => {
                return {
                  ...item,
                  props: {
                    ...item.props,
                    key: key,
                  },
                };
              })
            : children}
        </ol>
      </nav>
    </breadcrumbContext.Provider>
  );
}

interface LinkProps
  extends React.PropsWithChildren,
    React.ComponentPropsWithoutRef<"li"> {
  to?: string;
  active?: boolean;
  key?: number;
}

Breadcrumb.Link = ({
  className,
  to = "",
  active = false,
  children,
  key = 0,
  ...attr
}: LinkProps) => {
  const breadcrumb = useContext(breadcrumbContext);
  return (
    <li
      className={clsx([
        className,
        key > 0 && "relative ml-5 pl-0.5",
        !breadcrumb.light &&
          key > 0 &&
          "before:content-[''] before:w-[14px] before:h-[14px] before:bg-bredcrumb-chevron-dark before:bg-[length:100%] before:-ml-[1.125rem] before:absolute before:my-auto before:inset-y-0",
        breadcrumb.light &&
          key > 0 &&
          "before:content-[''] before:w-[14px] before:h-[14px] before:bg-bredcrumb-chevron-light before:bg-[length:100%] before:-ml-[1.125rem] before:absolute before:my-auto before:inset-y-0",
        key > 0 && "dark:before:bg-bredcrumb-chevron-darkmode",
        !breadcrumb.light &&
          active &&
          "text-slate-800 cursor-text dark:text-slate-400",
        breadcrumb.light && active && "text-white/70",
      ])}
      {...attr}
    >
      <Link to={to}>{children}</Link>
    </li>
  );
};

export default Breadcrumb;
