import Image from 'next/image'

interface Props {
  width: number
  height: number
}

const LoadingSpinner = ({ width, height }: Props) => {
  return <Image src="/loading-spinner.svg" alt="Loading Spinner" width={width} height={height} />
}

export default LoadingSpinner
