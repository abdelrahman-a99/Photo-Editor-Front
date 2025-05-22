"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageDisplay } from "@/components/editor/ImageDisplay"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePhotoStore } from "@/store/photo-store"
import { RotateCw, Crop as CropIcon, Maximize } from "lucide-react"
import { Label } from "@/components/ui/label"

const Editor = () => {
  const { currentImage } = usePhotoStore()
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)

  return (
    <div className="container mx-auto py-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Basic Editing</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 h-[500px]">
          <ImageDisplay />
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
                
                <TabsContent value="adjust" className="space-y-6">
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
                      >
                        <CropIcon className="h-4 w-4" />
                        <span>Crop</span>
                      </Button>
                      
                      <Button 
                        disabled={!currentImage} 
                        variant="outline" 
                        className="flex items-center gap-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <RotateCw className="h-4 w-4" />
                        <span>Rotate</span>
                      </Button>
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        disabled={!currentImage} 
                        variant="outline" 
                        className="w-full flex items-center gap-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Maximize className="h-4 w-4" />
                        <span>Resize</span>
                      </Button>
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
            Reset Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Editor
