"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageDisplay } from "@/components/editor/ImageDisplay"
import { usePhotoStore } from "@/store/photo-store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

const Noise = () => {
  const { currentImage, setCurrentImage, imageName } = usePhotoStore()
  const [noiseDensity, setNoiseDensity] = useState(10)
  const [kernelSize, setKernelSize] = useState(3)
  const [noiseType, setNoiseType] = useState("salt-pepper")
  const [filterType, setFilterType] = useState("median")
  const [frequency, setFrequency] = useState(20)
  const [amplitude, setAmplitude] = useState(50)
  const [pattern, setPattern] = useState("sine")
  const [cutoffFreq, setCutoffFreq] = useState(30)
  const [bandWidth, setBandWidth] = useState(10)
  const { toast } = useToast()

  const handleAddNoise = async () => {
    if (!currentImage || !imageName) return

    try {
      const formData = new FormData()
      // Convert base64 to File
      const imageResponse = await fetch(currentImage)
      const imageBlob = await imageResponse.blob()
      const file = new File([imageBlob], imageName, { type: 'image/png' })
      formData.append('file', file)
      formData.append('type', noiseType === 'salt-pepper' ? 'salt_pepper' : noiseType)
      
      // Set parameters based on noise type
      let params = {}
      if (noiseType === 'salt-pepper') {
        params = {
          density: noiseDensity / 100 // Convert percentage to decimal
        }
      } else if (noiseType === 'periodic') {
        params = {
          frequency: frequency,
          amplitude: amplitude,
          pattern: pattern
        }
      }
      
      formData.append('params', JSON.stringify(params))

      const noiseResponse = await fetch('http://localhost:5000/noise/add', {
        method: 'POST',
        body: formData
      })

      if (!noiseResponse.ok) {
        const errorData = await noiseResponse.json()
        throw new Error(errorData.error || 'Failed to add noise')
      }

      const data = await noiseResponse.json()
      
      // Fetch the processed image from the backend
      const processedImageResponse = await fetch(`http://localhost:5000/static/uploads/${data.processed_image}`)
      if (!processedImageResponse.ok) {
        throw new Error('Failed to fetch processed image')
      }
      
      const processedBlob = await processedImageResponse.blob()
      const processedImage = new File([processedBlob], imageName, { type: 'image/png' })
      
      // Convert File to base64 for the store
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCurrentImage(reader.result)
        }
      }
      reader.readAsDataURL(processedImage)

      toast({
        title: "Success",
        description: "Noise added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add noise",
        variant: "destructive"
      })
    }
  }

  const handleRemoveNoise = async () => {
    if (!currentImage || !imageName) return

    try {
      const formData = new FormData()
      // Convert base64 to File
      const imageResponse = await fetch(currentImage)
      const imageBlob = await imageResponse.blob()
      const file = new File([imageBlob], imageName, { type: 'image/png' })
      formData.append('file', file)
      formData.append('type', filterType)
      
      // Set parameters based on filter type
      let params = {}
      if (filterType === 'median') {
        params = {
          kernel_size: kernelSize
        }
      } else if (filterType === 'band_reject') {
        params = {
          cutoff_freq: cutoffFreq,
          width: bandWidth
        }
      }
      
      formData.append('params', JSON.stringify(params))

      const noiseResponse = await fetch('http://localhost:5000/noise/remove', {
        method: 'POST',
        body: formData
      })

      if (!noiseResponse.ok) {
        const errorData = await noiseResponse.json()
        throw new Error(errorData.error || 'Failed to remove noise')
      }

      const data = await noiseResponse.json()
      
      // Fetch the processed image from the backend
      const processedImageResponse = await fetch(`http://localhost:5000/static/uploads/${data.processed_image}`)
      if (!processedImageResponse.ok) {
        throw new Error('Failed to fetch processed image')
      }
      
      const processedBlob = await processedImageResponse.blob()
      const processedImage = new File([processedBlob], imageName, { type: 'image/png' })
      
      // Convert File to base64 for the store
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCurrentImage(reader.result)
        }
      }
      reader.readAsDataURL(processedImage)

      toast({
        title: "Success",
        description: "Noise removed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove noise",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="container mx-auto py-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Noise & FFT</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 h-[500px]">
          <ImageDisplay />
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-base text-gray-900 dark:text-gray-100">Noise & FFT Analysis</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3">
              <Tabs defaultValue="noise">
                <TabsList className="w-full mb-4 bg-gray-100 dark:bg-gray-700">
                  <TabsTrigger value="noise" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Noise</TabsTrigger>
                  <TabsTrigger value="fft" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">FFT</TabsTrigger>
                </TabsList>
                
                <TabsContent value="noise" className="space-y-6">
                  <Tabs defaultValue="add">
                    <TabsList className="w-full mb-4 bg-gray-100 dark:bg-gray-700">
                      <TabsTrigger value="add" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Add Noise</TabsTrigger>
                      <TabsTrigger value="remove" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Remove Noise</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="add" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="noise-type" className="text-gray-700 dark:text-gray-300">Noise Type</Label>
                        <Select 
                          disabled={!currentImage} 
                          value={noiseType}
                          onValueChange={setNoiseType}
                        >
                          <SelectTrigger id="noise-type" className="border-gray-200 dark:border-gray-700">
                            <SelectValue placeholder="Select noise type" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <SelectItem value="salt-pepper">Salt & Pepper</SelectItem>
                            <SelectItem value="periodic">Periodic Noise</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {noiseType === 'salt-pepper' && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="noise-density" className="text-gray-700 dark:text-gray-300">Noise Density</Label>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{noiseDensity}%</span>
                          </div>
                          <Slider 
                            id="noise-density"
                            min={1} 
                            max={100} 
                            step={1} 
                            value={[noiseDensity]}
                            onValueChange={(value) => setNoiseDensity(value[0])}
                            disabled={!currentImage}
                          />
                        </div>
                      )}

                      {noiseType === 'periodic' && (
                        <>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="frequency" className="text-gray-700 dark:text-gray-300">Frequency</Label>
                              <span className="text-sm text-gray-500 dark:text-gray-400">{frequency}</span>
                            </div>
                            <Slider 
                              id="frequency"
                              min={1} 
                              max={50} 
                              step={1} 
                              value={[frequency]}
                              onValueChange={(value) => setFrequency(value[0])}
                              disabled={!currentImage}
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="amplitude" className="text-gray-700 dark:text-gray-300">Amplitude</Label>
                              <span className="text-sm text-gray-500 dark:text-gray-400">{amplitude}</span>
                            </div>
                            <Slider 
                              id="amplitude"
                              min={1} 
                              max={100} 
                              step={1} 
                              value={[amplitude]}
                              onValueChange={(value) => setAmplitude(value[0])}
                              disabled={!currentImage}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="pattern" className="text-gray-700 dark:text-gray-300">Pattern</Label>
                            <Select 
                              disabled={!currentImage} 
                              value={pattern}
                              onValueChange={setPattern}
                            >
                              <SelectTrigger id="pattern" className="border-gray-200 dark:border-gray-700">
                                <SelectValue placeholder="Select pattern" />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <SelectItem value="sine">Sine Wave</SelectItem>
                                <SelectItem value="cosine">Cosine Wave</SelectItem>
                                <SelectItem value="square">Square Wave</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                      
                      <Button 
                        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" 
                        disabled={!currentImage}
                        onClick={handleAddNoise}
                      >
                        Add Noise
                      </Button>
                    </TabsContent>
                    
                    <TabsContent value="remove" className="space-y-4">
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
                            <SelectItem value="median">Median Filter</SelectItem>
                            <SelectItem value="notch">Notch Filter</SelectItem>
                            <SelectItem value="band_reject">Band Reject</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {filterType === 'median' && (
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
                      )}

                      {filterType === 'band_reject' && (
                        <>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="cutoff-freq" className="text-gray-700 dark:text-gray-300">Cutoff Frequency</Label>
                              <span className="text-sm text-gray-500 dark:text-gray-400">{cutoffFreq}</span>
                            </div>
                            <Slider 
                              id="cutoff-freq"
                              min={1} 
                              max={100} 
                              step={1} 
                              value={[cutoffFreq]}
                              onValueChange={(value) => setCutoffFreq(value[0])}
                              disabled={!currentImage}
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="band-width" className="text-gray-700 dark:text-gray-300">Band Width</Label>
                              <span className="text-sm text-gray-500 dark:text-gray-400">{bandWidth}</span>
                            </div>
                            <Slider 
                              id="band-width"
                              min={1} 
                              max={50} 
                              step={1} 
                              value={[bandWidth]}
                              onValueChange={(value) => setBandWidth(value[0])}
                              disabled={!currentImage}
                            />
                          </div>
                        </>
                      )}

                      {filterType === 'notch' && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Click on the image to select points for notch filtering. The filter will remove noise at the selected frequencies.
                        </div>
                      )}
                      
                      <Button 
                        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" 
                        disabled={!currentImage}
                        onClick={handleRemoveNoise}
                      >
                        Remove Noise
                      </Button>
                    </TabsContent>
                  </Tabs>
                </TabsContent>
                
                <TabsContent value="fft" className="space-y-4">
                  <div className="space-y-4">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" 
                      disabled={!currentImage}
                    >
                      Generate FFT
                    </Button>
                    
                    <Button 
                      className="w-full border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700" 
                      variant="outline"
                      disabled={!currentImage}
                    >
                      Inverse FFT
                    </Button>
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Click on the image to select points for mask filtering in FFT domain
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
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

export default Noise
