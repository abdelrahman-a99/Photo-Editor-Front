"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageDisplay } from "@/components/editor/ImageDisplay"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePhotoStore } from "@/store/photo-store"
import { RotateCw, Crop as CropIcon, Undo2, X, Check } from "lucide-react"
import { Label } from "@/components/ui/label"
import ReactCrop, { Crop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

const Editor = () => {
  const { currentImage, originalImage, rotateImage, cropImage, resizeImage, resetImage } = usePhotoStore()
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5
  })
  const [isCropping, setIsCropping] = useState(false)
  const [scale, setScale] = useState(100)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastCropRef = useRef<Crop | null>(null)

  // Reset scale when image is reset
  useEffect(() => {
    if (currentImage === originalImage) {
      setScale(100)
    }
  }, [currentImage, originalImage])

  // Function to create a centered crop
  const createCenterCrop = (image: HTMLImageElement) => {
    return centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
          height: 90,
        },
        1,
        image.width,
        image.height
      ),
      image.width,
      image.height
    )
  }

  // Reset crop state when starting a new crop
  const handleStartCrop = () => {
    if (originalImage && imgRef.current) {
      const image = imgRef.current
      
      // If we have a previous crop, use it
      if (lastCropRef.current) {
        setCrop(lastCropRef.current)
      } else {
        // Otherwise create a new centered crop
        const newCrop = createCenterCrop(image)
        setCrop(newCrop)
      }
    }
    setIsCropping(true)
  }

  const applyCrop = (crop: Crop) => {
    if (imgRef.current && crop.width && crop.height) {
      const image = imgRef.current
      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height

      // Calculate actual dimensions
      const cropWidth = crop.width * scaleX
      const cropHeight = crop.height * scaleY

      // Minimum dimensions (50% of the smaller image dimension)
      const minDimension = Math.min(image.naturalWidth, image.naturalHeight) * 0.5
      
      // Validate crop dimensions
      if (cropWidth < minDimension || cropHeight < minDimension) {
        // If crop is invalid, don't apply it
        return false
      }

      // Store the current crop for next time
      lastCropRef.current = crop

      cropImage({
        x: crop.x * scaleX,
        y: crop.y * scaleY,
        width: cropWidth,
        height: cropHeight
      })
      return true
    }
    return false
  }

  const handleCancelCrop = () => {
    setIsCropping(false)
  }

  const handleApplyCrop = () => {
    const success = applyCrop(crop)
    if (success) {
      setIsCropping(false)
    }
  }

  const handleRotate = () => {
    rotateImage(90)
  }

  const handleResize = (value: number[]) => {
    const newScale = value[0] / 100
    setScale(value[0])
    resizeImage(newScale)
  }

  // Handle image load to set initial crop
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const image = e.currentTarget
    if (lastCropRef.current) {
      setCrop(lastCropRef.current)
    } else {
      const newCrop = createCenterCrop(image)
      setCrop(newCrop)
    }
  }

  const handleReset = () => {
    resetImage()
    setScale(100)
  }

  return (
    <div className="container mx-auto py-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Basic Editing</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 h-[500px]" ref={containerRef}>
          {isCropping && originalImage ? (
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <ReactCrop
                crop={crop}
                onChange={(c: Crop) => {
                  // Validate crop size during change
                  if (c.width && c.height && imgRef.current) {
                    const image = imgRef.current
                    const minDimension = Math.min(image.width, image.height) * 0.5
                    const scaleX = image.naturalWidth / image.width
                    const scaleY = image.naturalHeight / image.height
                    
                    const cropWidth = c.width * scaleX
                    const cropHeight = c.height * scaleY
                    
                    if (cropWidth >= minDimension && cropHeight >= minDimension) {
                      setCrop(c)
                    }
                  }
                }}
                aspect={undefined}
                className="max-h-full max-w-full"
                minWidth={50}
                minHeight={50}
              >
                <img
                  ref={imgRef}
                  src={originalImage}
                  alt="Crop preview"
                  className="max-h-full max-w-full object-contain"
                  style={{ position: 'relative' }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                <Button
                  variant="outline"
                  className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={handleCancelCrop}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={handleApplyCrop}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Apply
                </Button>
              </div>
            </div>
          ) : (
            <ImageDisplay />
          )}
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-base text-gray-900 dark:text-gray-100">Tools</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3">
              <Tabs defaultValue="adjust">
                <TabsList className="w-full mb-4 bg-gray-100 dark:bg-gray-700">
                  <TabsTrigger value="adjust" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Adjust</TabsTrigger>
                  <TabsTrigger value="transform" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Transform</TabsTrigger>
                </TabsList>
                
                <TabsContent value="adjust">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="brightness" className="text-gray-700 dark:text-gray-300">Brightness</Label>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{brightness}%</span>
                      </div>
                      <Slider 
                        id="brightness"
                        min={0} 
                        max={200} 
                        step={1} 
                        value={[brightness]}
                        onValueChange={(value) => setBrightness(value[0])}
                        disabled={!currentImage}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="contrast" className="text-gray-700 dark:text-gray-300">Contrast</Label>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{contrast}%</span>
                      </div>
                      <Slider 
                        id="contrast"
                        min={0} 
                        max={200} 
                        step={1} 
                        value={[contrast]}
                        onValueChange={(value) => setContrast(value[0])}
                        disabled={!currentImage}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="saturation" className="text-gray-700 dark:text-gray-300">Saturation</Label>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{saturation}%</span>
                      </div>
                      <Slider 
                        id="saturation"
                        min={0} 
                        max={200} 
                        step={1} 
                        value={[saturation]}
                        onValueChange={(value) => setSaturation(value[0])}
                        disabled={!currentImage}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="transform">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        disabled={!currentImage} 
                        variant="outline" 
                        className="flex items-center gap-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={handleStartCrop}
                      >
                        <CropIcon className="h-4 w-4" />
                        <span>Crop</span>
                      </Button>
                      
                      <Button 
                        disabled={!currentImage} 
                        variant="outline" 
                        className="flex items-center gap-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={handleRotate}
                      >
                        <RotateCw className="h-4 w-4" />
                        <span>Rotate</span>
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="resize" className="text-gray-700 dark:text-gray-300">Resize</Label>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{scale}%</span>
                      </div>
                      <Slider 
                        id="resize"
                        min={10} 
                        max={200} 
                        step={1} 
                        value={[scale]}
                        onValueChange={handleResize}
                        disabled={!currentImage}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Button 
            variant="outline" 
            className="w-full border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700" 
            disabled={!currentImage || currentImage === originalImage}
            onClick={handleReset}
          >
            <Undo2 className="mr-2 h-4 w-4" />
            Reset Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Editor
