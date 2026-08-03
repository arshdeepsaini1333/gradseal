"use client"

import * as React from "react"
import { UploadCloud, X, Loader2, ImageIcon, FileVideo } from "lucide-react"

import { cn } from "@/lib/utils"
import { requestCourseUploadUrl } from "@/actions/admin-courses"
import { Progress } from "@/components/admin/ui/progress"
import { Button } from "@/components/admin/ui/button"
import type { UploadKind } from "@/types/course"

interface UploadItem {
  id: string
  name: string
  url?: string
  progress: number
  status: "uploading" | "done" | "error"
  error?: string
}

interface FileUploadFieldProps {
  kind: UploadKind
  accept: string
  media: "image" | "video"
  multiple?: boolean
  maxSizeMB: number
  urls: string[]
  onChange: (urls: string[]) => void
  className?: string
}

function uploadFile(
  file: File,
  kind: UploadKind,
  onProgress: (percent: number) => void
): Promise<string> {
  return requestCourseUploadUrl({
    fileName: file.name,
    contentType: file.type,
    kind,
  }).then(
    ({ uploadUrl, publicUrl }) =>
      new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open("PUT", uploadUrl)
        xhr.setRequestHeader("Content-Type", file.type)
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            onProgress(Math.round((event.loaded / event.total) * 100))
          }
        }
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(publicUrl)
          } else {
            reject(new Error("Upload failed"))
          }
        }
        xhr.onerror = () => reject(new Error("Upload failed"))
        xhr.send(file)
      })
  )
}

export function FileUploadField({
  kind,
  accept,
  media,
  multiple = false,
  maxSizeMB,
  urls,
  onChange,
  className,
}: FileUploadFieldProps) {
  const [items, setItems] = React.useState<UploadItem[]>(() =>
    urls.map((url, i) => ({ id: `existing-${i}`, name: url.split("/").pop() || "file", url, progress: 100, status: "done" }))
  )
  const inputRef = React.useRef<HTMLInputElement>(null)

  const onChangeRef = React.useRef(onChange)
  onChangeRef.current = onChange

  React.useEffect(() => {
    onChangeRef.current(items.filter((item) => item.status === "done" && item.url).map((item) => item.url!))
  }, [items])

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const selected = multiple ? Array.from(files) : [files[0]]

    for (const file of selected) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        const errored: UploadItem = {
          id: crypto.randomUUID(),
          name: file.name,
          progress: 0,
          status: "error",
          error: `File exceeds ${maxSizeMB}MB`,
        }
        setItems((prev) => (multiple ? [...prev, errored] : [errored]))
        continue
      }

      const id = crypto.randomUUID()
      const pending: UploadItem = { id, name: file.name, progress: 0, status: "uploading" }
      setItems((prev) => (multiple ? [...prev, pending] : [pending]))

      uploadFile(file, kind, (progress) => {
        setItems((prev) => {
          const next = prev.map((item) => (item.id === id ? { ...item, progress } : item))
          return next
        })
      })
        .then((url) => {
          setItems((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, url, progress: 100, status: "done" as const } : item
            )
          )
        })
        .catch((error: Error) => {
          setItems((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, status: "error" as const, error: error.message } : item
            )
          )
        })
    }
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const Icon = media === "image" ? ImageIcon : FileVideo

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ""
        }}
      />

      {(multiple || items.length === 0) && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-input bg-transparent px-4 py-6 text-sm text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
        >
          <UploadCloud className="size-5" />
          <span>
            {media === "image" ? "Upload image" : "Upload video"} (max {maxSizeMB}MB)
          </span>
        </button>
      )}

      {items.length > 0 && (
        <ul className="space-y-1.5">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 text-xs"
            >
              <Icon className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{item.name}</p>
                {item.status === "uploading" && <Progress value={item.progress} className="mt-1 h-1" />}
                {item.status === "error" && <p className="text-destructive">{item.error}</p>}
              </div>
              {item.status === "uploading" && <Loader2 className="size-3.5 shrink-0 animate-spin text-muted-foreground" />}
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => removeItem(item.id)}
                aria-label="Remove file"
              >
                <X />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
