/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/function-component-definition */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/order */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable prettier/prettier */
import React, { useRef, useEffect } from "react"
import Tippy from "../../components/common/tippy"
import { PopperElement } from "tippy.js";

type MainProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  {
    content: string;
  }
>;

const toggleTooltip = (el: PopperElement) => {
  if (window.innerWidth <= 1260) {
    el._tippy?.enable();
  } else {
    el._tippy?.disable();
  }
};

const initTooltipEvent = (tippyRef: PopperElement) => {
  window.addEventListener("resize", () => {
    toggleTooltip(tippyRef);
  });
};

const Main = <C extends React.ElementType = "a">(props: MainProps<C>) => {
  const tippyRef = useRef<PopperElement>();
  const Component: React.ElementType = props.as || "a";

  useEffect(() => {
    if (tippyRef.current !== undefined) {
      toggleTooltip(tippyRef.current);
      initTooltipEvent(tippyRef.current);
    }
  }, [tippyRef.current]);

  const { as, ...computedProps } = props;
  return (
    <Tippy
      {...computedProps}
      as={Component}
      content={props.content}
      options={{
        placement: "left",
      }}
      getRef={(el: PopperElement | null) => {
        if (el !== null) {
          tippyRef.current = el;
        }
      }}
    >
      {props.children}
    </Tippy>
  );
};

export default Main;
