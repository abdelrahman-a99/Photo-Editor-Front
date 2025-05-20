"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageDisplay } from "@/components/editor/ImageDisplay"
import { usePhotoStore } from "@/store/photo-store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { useState } from "react"

const Filters = () => {
  const { currentImage } = usePhotoStore()
  const [filterType, setFilterType] = useState("sobel")
  const [kernelSize, setKernelSize] = useState(3)

  return (
    <div className="container mx-auto py-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Image Filters</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 h-[500px]">
          <ImageDisplay />
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="px-4 py-3">
              <CardTitle className="text-base">Filter Settings</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="filter-type">Filter Type</Label>
                <Select 
                  disabled={!currentImage} 
                  value={filterType}
                  onValueChange={setFilterType}
                >
                  <SelectTrigger id="filter-type">
                    <SelectValue placeholder="Select filter type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sobel">Sobel Filter</SelectItem>
                    <SelectItem value="laplace">Laplacian Filter</SelectItem>
                    <SelectItem value="gaussian">Gaussian Blur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="kernel-size">Kernel Size</Label>
                  <span className="text-sm text-muted-foreground">{kernelSize}x{kernelSize}</span>
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
                  <Label htmlFor="direction">Direction</Label>
                  <Select disabled={!currentImage} defaultValue="both">
                    <SelectTrigger id="direction">
                      <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="x">X direction</SelectItem>
                      <SelectItem value="y">Y direction</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <Button 
                className="w-full mt-4" 
                disabled={!currentImage}
              >
                Apply Filter
              </Button>
            </CardContent>
          </Card>

          <Button 
            variant="outline" 
            className="w-full" 
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
