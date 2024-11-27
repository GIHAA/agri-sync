import {
  createContext,
  useState,
  useContext,
  ReactNode,
  ReactElement,
} from 'react'

interface PreviewComponentProps {
  children: ReactElement | ((props: { toggle: () => void }) => ReactNode)
}

const previewCodeContext = createContext(true)

function PreviewComponent({
  className,
  children,
}: PreviewComponentProps &
  Omit<React.ComponentPropsWithoutRef<'div'>, keyof PreviewComponentProps>) {
  const [previewCode, setPreviewCode] = useState(true)

  return (
    <previewCodeContext.Provider value={previewCode}>
      <div className={className}>
        {typeof children === 'function'
          ? children({
              toggle: () => {
                setPreviewCode(!previewCode)
              },
            })
          : children}
      </div>
    </previewCodeContext.Provider>
  )
}

type PreviewProps = React.PropsWithChildren

function Preview({ children }: PreviewProps) {
  const previewCode = useContext(previewCodeContext)
  return <div>{previewCode ? children : ''}</div>
}

export { PreviewComponent, Preview }
