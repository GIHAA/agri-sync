import Hotkeys from 'react-hot-keys'

function ShortcutKey({ onKeyUp }: { onKeyUp: (keyName: string) => void }) {
  return <Hotkeys keyName="shift+a,alt+s" onKeyUp={onKeyUp} />
}

export default ShortcutKey
