type Props = {
  address: string
  time: BigInt
  message: string
}

const Wave = ({ address, time, message }: Props) => {
  return (
    <div className="space-y-2 overflow-hidden border border-cyan-600 bg-cyan-100/50 p-2 backdrop-blur">
      <div>
        <div className="text-xs text-cyan-600">Address:</div>
        <div className="mt-1 truncate text-cyan-800">{address}</div>
      </div>
      <div>
        <div className="text-xs text-cyan-600">Time:</div>
        <div className="mt-1 whitespace-normal text-sm text-cyan-800">{time.toString()}</div>
      </div>
      <div>
        <div className="text-xs text-cyan-600">Message:</div>{' '}
        <div className="mt-1 whitespace-normal font-semibold text-cyan-800">{message}</div>
      </div>
    </div>
  )
}
export default Wave
