"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageDisplay } from "@/components/editor/ImageDisplay"
import { usePhotoStore } from "@/store/photo-store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Photo Editor - Image Filters",
  description: "Apply various image filters including Sobel, Laplacian, and Gaussian blur",
}

const Filters = () => {
  const { currentImage } = usePhotoStore()
  const [filterType, setFilterType] = useState("sobel")
  const [kernelSize, setKernelSize] = useState(3)

  return (
    <div className="container mx-auto py-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Image Filters</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 h-[500px]">
          <ImageDisplay />
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-base text-gray-900 dark:text-gray-100">Filter Settings</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="filter-type" className="text-gray-700 dark:text-gray-300">Filter Type</Label>
                <Select 
                  disabled={!currentImage} 
                  value={filterType}
                  onValueChange={setFilterType}
                >
                  <SelectTrigger id="filter-type" className="border-gray-200 dark:border-gray-700">
                    <SelectValue placeholder="Select filter type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectItem value="sobel">Sobel Filter</SelectItem>
                    <SelectItem value="laplace">Laplacian Filter</SelectItem>
                    <SelectItem value="gaussian">Gaussian Blur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="kernel-size" className="text-gray-700 dark:text-gray-300">Kernel Size</Label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{kernelSize}x{kernelSize}</span>
                </div>
                <Slider 
                  id="kernel-size"
                  min={3} 
                  max={9} 
                  step={2} 
                  value={[kernelSize]}
                  onValueChange={(value) => setKernelSize(value[0])}
                  disabled={!currentImage}
                />
              </div>
              
              {filterType === "sobel" && (
                <div className="space-y-2">
                  <Label htmlFor="direction" className="text-gray-700 dark:text-gray-300">Direction</Label>
                  <Select disabled={!currentImage} defaultValue="both">
                    <SelectTrigger id="direction" className="border-gray-200 dark:border-gray-700">
                      <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <SelectItem value="x">X direction</SelectItem>
                      <SelectItem value="y">Y direction</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <Button 
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" 
                disabled={!currentImage}
              >
                Apply Filter
              </Button>
            </CardContent>
          </Card>

          <Button 
            variant="outline" 
            className="w-full border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700" 
            disabled={!currentImage}
          >
            Reset Image
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Filters
