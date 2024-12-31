'use client'

import { Check, Copy } from "lucide-react"
import { Button } from "./button"
import { useState } from "react"

interface CopyButtonProps {
  value: string
}

export function CopyButton({ value }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false)

  const onCopy = () => {
    if (!value) return

    setIsCopied(true)
    navigator.clipboard.writeText(value)
    setTimeout(() => setIsCopied(false), 1000)
  }

  return (
    <Button
      onClick={onCopy}
      size="sm"
      variant="ghost"
      className="h-8 w-8 p-0"
    >
      {isCopied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  )
}
