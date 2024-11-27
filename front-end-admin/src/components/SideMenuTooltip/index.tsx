/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/function-component-definition */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/order */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable prettier/prettier */
import React, { useRef, useEffect } from "react"
import Agrisyncpy from "../../components/common/agrisyncpy"
import { PopperElement } from "agrisyncpy.js";

type MainProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  {
    content: string;
  }
>;

const toggleToolagrisync = (el: PopperElement) => {
  if (window.innerWidth <= 1260) {
    el._agrisyncpy?.enable();
  } else {
    el._agrisyncpy?.disable();
  }
};

const initToolagrisyncEvent = (agrisyncpyRef: PopperElement) => {
  window.addEventListener("resize", () => {
    toggleToolagrisync(agrisyncpyRef);
  });
};

const Main = <C extends React.ElementType = "a">(props: MainProps<C>) => {
  const agrisyncpyRef = useRef<PopperElement>();
  const Component: React.ElementType = props.as || "a";

  useEffect(() => {
    if (agrisyncpyRef.current !== undefined) {
      toggleToolagrisync(agrisyncpyRef.current);
      initToolagrisyncEvent(agrisyncpyRef.current);
    }
  }, [agrisyncpyRef.current]);

  const { as, ...computedProps } = props;
  return (
    <Agrisyncpy
      {...computedProps}
      as={Component}
      content={props.content}
      options={{
        placement: "left",
      }}
      getRef={(el: PopperElement | null) => {
        if (el !== null) {
          agrisyncpyRef.current = el;
        }
      }}
    >
      {props.children}
    </Agrisyncpy>
  );
};

export default Main;
