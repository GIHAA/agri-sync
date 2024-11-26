type PolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>['ref']

type AsProp<C extends React.ElementType> = {
  as?: C
}

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P)

// eslint-disable-next-line @typescript-eslint/ban-types
type PolymorphicComponentProp<C extends React.ElementType, Props = {}> = Omit<
  React.PropsWithChildren<AsProp<C>>,
  keyof Props
> &
  Props &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>

type PolymorphicComponentPropWithRef<
  C extends React.ElementType,
  // eslint-disable-next-line @typescript-eslint/ban-types
  Props = {}
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> }

type ExtractProps<T> = T extends React.ComponentType<infer P> ? P : T
