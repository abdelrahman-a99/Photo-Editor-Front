"use client"

import React from "react"

import { Button } from "@/components/ui/button"

import { Upload } from "lucide-react"

import { ImageDisplay } from "@/components/editor/ImageDisplay"
import { usePhotoStore } from "@/store/photo-store"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const { uploadImage } = usePhotoStore()
  const { toast } = useToast()

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const reader = new FileReader()
      reader.onload = async (event) => {
        if (event.target && typeof event.target.result === "string") {
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
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <div className="container mx-auto py-6 flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="flex-1 grid grid-cols-1 gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome to Photo Editor</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Upload an image to start editing or analyzing with advanced image processing tools.
          </p>
        </div>

        <div
          className="flex items-center justify-center w-full h-96"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <ImageDisplay />
        </div>

        <div className="flex flex-col items-center justify-center gap-4 mt-4">
          <div className="text-center max-w-md">
            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">Get Started</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Drag and drop your image above or click the button below to upload
            </p>
            <div>
              <input
                type="file"
                id="home-file-upload"
                className="hidden"
                accept="image/*"
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0]
                    const reader = new FileReader()
                    reader.onload = async (event) => {
                      if (event.target && typeof event.target.result === "string") {
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
                }}
              />
              <Button asChild variant="default" size="lg">
                <label htmlFor="home-file-upload" className="cursor-pointer">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Image
                </label>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
