import LitepickerJs from 'litepicker'
import { ILPConfiguration } from 'litepicker/dist/types/interfaces'

export interface LitepickerElement extends HTMLInputElement {
  litePickerInstance: LitepickerJs
}

type LitepickerConfig = Partial<ILPConfiguration>

interface MainProps {
  options: {
    format?: string | undefined
  } & LitepickerConfig
  value: string
  formInputSize?: 'sm' | 'lg'
  onChange: (date: string) => void
  getRef: (el: LitepickerElement) => void
}

export type LitepickerProps = MainProps &
  Omit<React.ComponentPropsWithoutRef<'input'>, keyof MainProps>
