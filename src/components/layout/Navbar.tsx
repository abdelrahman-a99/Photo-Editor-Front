'use client';

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Download, Upload, Loader2 } from "lucide-react"
import { useCallback } from "react"
import { usePhotoStore } from "@/store/photo-store"
import { useToast } from "@/hooks/use-toast"

export const Navbar = () => {
  const { uploadImage, currentImage, isProcessing, error, downloadImage } = usePhotoStore()
  const { toast } = useToast()

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = async (event) => {
        if (event.target && typeof event.target.result === 'string') {
          try {
            await uploadImage(event.target.result, file.name)
            toast({
              title: "Success",
              description: "Image uploaded successfully",
            })
          } catch (error) {
            toast({
              title: "Error",
              description: error instanceof Error ? error.message : "Failed to upload image",
              variant: "destructive",
            })
          }
        }
      }
      reader.readAsDataURL(file)
    }
  }, [uploadImage, toast])

  const handleDownload = useCallback(async () => {
    try {
      await downloadImage();
      toast({
        title: "Success",
        description: "Image downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to download image",
        variant: "destructive",
      });
    }
  }, [downloadImage, toast]);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Photo Editor</h1>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/*"
              onChange={handleUpload}
              disabled={isProcessing}
            />
            <Button asChild variant="outline" size="sm" disabled={isProcessing}>
              <label htmlFor="file-upload" className="cursor-pointer">
                {isProcessing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                {isProcessing ? "Uploading..." : "Upload Image"}
              </label>
            </Button>
          </div>

          <Button
            variant="default"
            size="sm"
            disabled={!currentImage || isProcessing}
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </header>
  )
}
