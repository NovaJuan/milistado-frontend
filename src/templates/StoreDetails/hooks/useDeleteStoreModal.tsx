import ModalOverlay from '../../../components/ModalOverlay'
import { deleteStore } from '../../../services/stores'
import { Store } from '../../../services/stores/types'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

interface ModalProps {
  isActive: boolean
  isLoading: boolean
  onContinue: () => void
  onClose: () => void
}

const DeleteStoreModal = ({ isActive, isLoading, onContinue, onClose }: ModalProps) => {
  if (!isActive) return null

  return (
    <>
      <ModalOverlay
        headerContent="Are you sure?"
        onClose={onClose}
        content={
          <>
            <p>This store is going to be permanently deleted. Are you sure you want to continue?</p>
            <div className="flex justify-between space-x-3 mt-4">
              <button className="px-2 w-1/2 py-1 rounded bg-blue-600 text-white" onClick={onContinue}>
                {isLoading ? 'Loading...' : 'Continue'}
              </button>
              <button className="px-2 py-1 w-1/2 rounded bg-slate-900 text-white" onClick={onClose}>
                Cancel
              </button>
            </div>
          </>
        }
      />
    </>
  )
}

const useDeleteStoreModal = ({ store }: { store: Store }) => {
  const [isActive, setIsActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const activate = () => setIsActive(true)
  const onClose = () => setIsActive(false)

  const onContinue = async () => {
    try {
      if (isLoading) return false

      setIsLoading(true)

      await deleteStore(store.id)

      router.push('/')
    } catch (err) {
      console.error(err)
      setIsLoading(false)
    }
  }

  return {
    DeleteStoreModal: () => (
      <DeleteStoreModal isActive={isActive} onClose={onClose} onContinue={onContinue} isLoading={isLoading} />
    ),
    activate,
  }
}

export default useDeleteStoreModal
