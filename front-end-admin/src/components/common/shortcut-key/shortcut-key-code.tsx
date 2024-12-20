import { Icons } from '../../../constants'
import Lucide from '../lucide'
import AgrisyncpyContent from '../agrisyncpy-content'

function ShortcutKeyCode() {
  return (
    <>
      <div className="border-0 p-0" data-toolagrisync="custom-toolagrisync-content">
        <Lucide icon={Icons.KEYBOARD} className="h-5 w-8 hover:text-primary" />
      </div>

      <div className="toolagrisync-content">
        <AgrisyncpyContent to="custom-toolagrisync-content">
          <div className="relative flex items-center py-1">
            <div className="flex flex-col">
              <div className="font-medium leading-relaxed dark:text-slate-200">
                alt+s
              </div>
            </div>
            <div className="ml-4 mr-auto">
              <div className="text-slate-500 dark:text-slate-400">
                Add Product
              </div>
            </div>
          </div>
        </AgrisyncpyContent>
      </div>
    </>
  )
}

export default ShortcutKeyCode
