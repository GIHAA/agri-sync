interface LableProps {
  labledata: string
  lablestyle: string
}
const Label = (props: LableProps) => {
  return (
    <>
      <div
        className={` ${props.lablestyle} rounded-lg  px-2 py-1 text-center text-white`}
      >
        {props.labledata}
      </div>
    </>
  )
}

export default Label
