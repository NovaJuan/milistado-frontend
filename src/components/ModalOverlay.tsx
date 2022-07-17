import React from 'react'
import { FiX } from 'react-icons/fi'

interface ModalOverlayInterface {
  headerContent: React.ReactNode
  content: React.ReactNode
  onClose: () => void
}

const ModalOverlay = ({ headerContent, content, onClose }: ModalOverlayInterface) => {
  return (
    <div className="z-50 w-screen h-screen fixed top-0 left-0">
      <div className="absolute w-full h-full top-0 left-0 bg-black opacity-60" onClick={onClose}></div>

      <div className="absolute left-0 top-19 w-full text-black">
        <div className="mx-auto w-full max-w-96">
          <div className="mx-4 bg-white rounded overflow-hidden">
            <div className="px-4 py-2.5 flex items-center">
              <h1 className="font-bold">{headerContent}</h1>
              <FiX className="ml-auto cursor-pointer" size={20} onClick={onClose} />
            </div>
            <div className="px-4 py-2.5">{content}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalOverlay
