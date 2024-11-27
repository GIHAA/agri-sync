/* eslint-disable prettier/prettier */
import { Icons } from '../../../constants'

import SharedDataContainer from '../../../containers/sharedData'
import Lucide from '../lucide'

function DarkModeSwitch() {
  const { localStorageDarkMode: darkMode, switchMode } = SharedDataContainer.useContainer()

  return (
    <div
      className="z-50 flex h-12 cursor-pointer items-center justify-center"
      onClick={switchMode}
      aria-hidden="true"
    >
      <Lucide icon={darkMode ? Icons.MOON : Icons.SUN} className="h-5 w-5" />
    </div>
  )
}

export default DarkModeSwitch
