/* eslint-disable react/function-component-definition */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import ReactQuill from 'react-quill'

const TextEditor = ({
  onChange,
  value,
}: {
  onChange: (value: string) => void
  value: string
}) => {
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

  return (
    <div className="my-3 h-full max-h-[400px] min-h-[400px] rounded-lg">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={module}
        placeholder="Write something..."
        style={{
          height: '300px',
          minHeight: '300px',
          maxHeight: '300px',
          borderRadius: '7px',
        }}
      />
    </div>
  )
}

export default TextEditor
