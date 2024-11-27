/* eslint-disable import/no-useless-path-segments */
/* eslint-disable react/button-has-type */
/* eslint-disable react/require-default-props */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable react/function-component-definition */
/* eslint-disable react/self-closing-comp */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import SlideoverPanel from '../../components/slideover-panel'
import SharedDataContainer from '../../containers/sharedData'

const QuilEditor = ({ defaultText, onUpdate, onCancel }: any) => {
  const [value, setValue] = useState(defaultText)
  const { handleSlider } = SharedDataContainer.useContainer()

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    [{ header: 1 }, { header: 2 }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ['clean'],
    ['image'],
  ]

  const module = {
    toolbar: toolbarOptions,
  }

  const handleUpdate = () => {
    onUpdate(value)
    handleSlider()
  }

  return (
    <>
      <div className="my-3 h-full max-h-[400px] min-h-[400px] w-full">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          modules={module}
          placeholder={defaultText}
          style={{
            height: '300px',
            minHeight: '300px',
            maxHeight: '300px',
            borderRadius: '7px',
          }}
        />
      </div>
      <div className="mb-3 flex w-full items-center justify-end gap-3">
        <button
          className="min-w-[104px] max-w-[104px] rounded-lg bg-black px-3 py-2 text-center text-[15px] text-white"
          onClick={() => handleUpdate()}
        >
          Update
        </button>
        <button
          className="min-w-[104px] max-w-[104px] rounded-lg bg-[#728196] px-3 py-2 text-center text-[15px] text-gray-50"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </>
  )
}

export default QuilEditor
