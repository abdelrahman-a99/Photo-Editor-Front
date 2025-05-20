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
        <h2 className="text-2xl font-bold">Basic Editing</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 h-[500px]">
          <ImageDisplay />
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="px-4 py-3">
              <CardTitle className="text-base">Tools</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3">
              <Tabs defaultValue="adjust">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="adjust" className="flex-1">Adjust</TabsTrigger>
                  <TabsTrigger value="transform" className="flex-1">Transform</TabsTrigger>
                </TabsList>
                
                <TabsContent value="adjust" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="brightness">Brightness</Label>
                        <span className="text-sm text-muted-foreground">{brightness}%</span>
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
                        <Label htmlFor="contrast">Contrast</Label>
                        <span className="text-sm text-muted-foreground">{contrast}%</span>
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
                        <Label htmlFor="saturation">Saturation</Label>
                        <span className="text-sm text-muted-foreground">{saturation}%</span>
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
                      <Button disabled={!currentImage} variant="outline" className="flex items-center gap-2">
                        <CropIcon className="h-4 w-4" />
                        <span>Crop</span>
                      </Button>
                      
                      <Button disabled={!currentImage} variant="outline" className="flex items-center gap-2">
                        <RotateCw className="h-4 w-4" />
                        <span>Rotate</span>
                      </Button>
                    </div>
                    
                    <div className="pt-2">
                      <Button disabled={!currentImage} variant="outline" className="w-full flex items-center gap-2">
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
            className="w-full" 
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
