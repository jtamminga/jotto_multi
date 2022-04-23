type ToastProps = {
  message: string
}

export function ErrorToast({ message }: ToastProps) {
  return (
    <div className="p-2 bg-red-400 text-white rounded text-center">
      {message}
    </div>
  )
}