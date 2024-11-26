import * as lucideIcons from 'lucide-react'

interface LocalStorageDarkMode {
  key: string
  value: boolean
}

interface EndpointPathId {
  id: number
}

const { ...icons } = lucideIcons
type Icon = keyof typeof icons

export type { LocalStorageDarkMode, EndpointPathId, Icon }
