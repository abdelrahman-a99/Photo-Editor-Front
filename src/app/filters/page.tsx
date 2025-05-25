"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageDisplay } from "@/components/editor/ImageDisplay"
import { usePhotoStore } from "@/store/photo-store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

const Filters = () => {
  const { currentImage, applyFilter, resetImage, isProcessing } = usePhotoStore()
  const { toast } = useToast()
  const [filterType, setFilterType] = useState("sobel")
  const [kernelSize, setKernelSize] = useState(3)
  const [sigma, setSigma] = useState(0)
  const [direction, setDirection] = useState("both")
  const [strength, setStrength] = useState(1.0)

  const handleApplyFilter = async () => {
    try {
      const params: Record<string, number | string> = {}
      
      switch (filterType) {
        case 'sobel':
          params.direction = direction
          params.kernel_size = kernelSize
          break
        case 'laplace':
          params.kernel_size = kernelSize
          break
        case 'gaussian':
          params.kernel_size = kernelSize
          params.sigma = sigma
          break
        case 'mean':
        case 'median':
          params.kernel_size = kernelSize
          break
        case 'bilateral':
          params.d = kernelSize
          params.sigma_color = sigma
          params.sigma_space = sigma
          break
        case 'sharpen':
          params.kernel_size = kernelSize
          params.strength = strength
          break
        case 'emboss':
          params.direction = direction
          break
      }

      await applyFilter(filterType, params)
      toast({
        title: "Success",
        description: "Filter applied successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to apply filter",
        variant: "destructive",
      })
    }
  }

  const handleReset = () => {
    resetImage()
    toast({
      title: "Success",
      description: "Image reset to original",
    })
  }

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
                  disabled={!currentImage || isProcessing} 
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
                    <SelectItem value="mean">Mean Filter</SelectItem>
                    <SelectItem value="median">Median Filter</SelectItem>
                    <SelectItem value="bilateral">Bilateral Filter</SelectItem>
                    <SelectItem value="sharpen">Sharpen Filter</SelectItem>
                    <SelectItem value="emboss">Emboss Filter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {['sobel', 'laplace', 'gaussian', 'mean', 'median', 'bilateral', 'sharpen'].includes(filterType) && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="kernel-size" className="text-gray-700 dark:text-gray-300">Kernel Size</Label>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{kernelSize}x{kernelSize}</span>
                  </div>
                  <Slider 
                    id="kernel-size"
                    min={3} 
                    max={15} 
                    step={2} 
                    value={[kernelSize]}
                    onValueChange={(value) => setKernelSize(value[0])}
                    disabled={!currentImage || isProcessing}
                  />
                </div>
              )}
              
              {['gaussian', 'bilateral'].includes(filterType) && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="sigma" className="text-gray-700 dark:text-gray-300">Sigma</Label>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{sigma}</span>
                  </div>
                  <Slider 
                    id="sigma"
                    min={0} 
                    max={100} 
                    step={1} 
                    value={[sigma]}
                    onValueChange={(value) => setSigma(value[0])}
                    disabled={!currentImage || isProcessing}
                  />
                </div>
              )}
              
              {['sobel', 'emboss'].includes(filterType) && (
                <div className="space-y-2">
                  <Label htmlFor="direction" className="text-gray-700 dark:text-gray-300">Direction</Label>
                  <Select 
                    disabled={!currentImage || isProcessing} 
                    value={direction}
                    onValueChange={setDirection}
                  >
                    <SelectTrigger id="direction" className="border-gray-200 dark:border-gray-700">
                      <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <SelectItem value="both">Both</SelectItem>
                      <SelectItem value="horizontal">Horizontal</SelectItem>
                      <SelectItem value="vertical">Vertical</SelectItem>
                      {filterType === 'emboss' && (
                        <>
                          <SelectItem value="north">North</SelectItem>
                          <SelectItem value="south">South</SelectItem>
                          <SelectItem value="east">East</SelectItem>
                          <SelectItem value="west">West</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {filterType === 'sharpen' && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="strength" className="text-gray-700 dark:text-gray-300">Strength</Label>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{strength.toFixed(1)}</span>
                  </div>
                  <Slider 
                    id="strength"
                    min={0.1} 
                    max={2} 
                    step={0.1} 
                    value={[strength]}
                    onValueChange={(value) => setStrength(value[0])}
                    disabled={!currentImage || isProcessing}
                  />
                </div>
              )}
              
              <Button 
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" 
                disabled={!currentImage || isProcessing}
                onClick={handleApplyFilter}
              >
                {isProcessing ? "Applying..." : "Apply Filter"}
              </Button>
            </CardContent>
          </Card>

          <Button 
            variant="outline" 
            className="w-full border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700" 
            disabled={!currentImage || isProcessing}
            onClick={handleReset}
          >
            Reset Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Filters
