import { useState, useCallback } from 'react'

interface ConfirmOptions {
  title: string
  body: string
  confirmLabel?: string
}

interface ConfirmState extends ConfirmOptions {
  resolve: (confirmed: boolean) => void
}

export function useConfirm() {
  const [state, setState] = useState<ConfirmState | null>(null)

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setState({ ...options, resolve })
    })
  }, [])

  const handleConfirm = () => {
    state?.resolve(true)
    setState(null)
  }

  const handleCancel = () => {
    state?.resolve(false)
    setState(null)
  }

  return { confirm, confirmState: state, handleConfirm, handleCancel }
}
