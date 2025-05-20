'use client';

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Download, Upload } from "lucide-react"
import { useCallback } from "react"
import { usePhotoStore } from "@/store/photo-store"

export const Navbar = () => {
  const { uploadImage, currentImage } = usePhotoStore()

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          uploadImage(event.target.result, file.name)
        }
      }
      reader.readAsDataURL(file)
    }
  }, [uploadImage])

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-xl font-bold">Photo Editor</h1>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/*"
              onChange={handleUpload}
            />
            <Button asChild variant="outline" size="sm">
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </label>
            </Button>
          </div>

          <Button
            variant="default"
            size="sm"
            disabled={!currentImage}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </header>
  )
}
