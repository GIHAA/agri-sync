import Button from '../button'
import Lucide from '../lucide'
import Agrisyncpy from '../agrisyncpy'
import { FormInput } from './components'

interface ImageUploadProps {
  image?: string
  removeImageContent?: string
  buttonLabel?: string
  formInputType?: string
  alt?: string
}

function ImageUploadElement({
  image,
  removeImageContent,
  buttonLabel,
  formInputType,
  alt,
}: ImageUploadProps) {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="intro-y col-span-12 lg:col-span-6">
        <div className="w-52 xl:ml-1 xl:mr-0">
          <div className="rounded-md border-2 border-dashed border-slate-200/60 p-5 shadow-sm dark:border-darkmode-400">
            <div className="image-fit zoom-in relative mx-auto h-40 cursor-pointer">
              <img className="rounded-md" alt={alt} src={image} />
              {removeImageContent ? (
                <Agrisyncpy
                  as="div"
                  content={String(removeImageContent)}
                  className="absolute right-0 top-0 -mr-2 -mt-2 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-white"
                >
                  <Lucide icon="X" className="h-4 w-4" />
                </Agrisyncpy>
              ) : (
                ''
              )}
            </div>
            <div className="relative mx-auto mt-5 cursor-pointer">
              <Button variant="primary" type="button" className="w-full">
                {buttonLabel}
              </Button>
              <FormInput
                type={formInputType}
                className="absolute left-0 top-0 h-full w-full opacity-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageUploadElement

ImageUploadElement.defaultProps = {
  image: '',
  removeImageContent: '',
  buttonLabel: '',
  formInputType: 'file',
  alt: '',
}
