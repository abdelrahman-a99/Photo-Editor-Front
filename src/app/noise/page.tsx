"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageDisplay } from "@/components/editor/ImageDisplay"
import { usePhotoStore } from "@/store/photo-store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

const Noise = () => {
  const { currentImage } = usePhotoStore()

  return (
    <div className="container mx-auto py-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Noise & FFT</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 h-[500px]">
          <ImageDisplay />
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="px-4 py-3">
              <CardTitle className="text-base">Noise & FFT Analysis</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3">
              <Tabs defaultValue="noise">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="noise" className="flex-1">Noise</TabsTrigger>
                  <TabsTrigger value="fft" className="flex-1">FFT</TabsTrigger>
                </TabsList>
                
                <TabsContent value="noise" className="space-y-6">
                  <Tabs defaultValue="add">
                    <TabsList className="w-full mb-4">
                      <TabsTrigger value="add" className="flex-1">Add Noise</TabsTrigger>
                      <TabsTrigger value="remove" className="flex-1">Remove Noise</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="add" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="noise-type">Noise Type</Label>
                        <Select disabled={!currentImage} defaultValue="salt-pepper">
                          <SelectTrigger id="noise-type">
                            <SelectValue placeholder="Select noise type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="salt-pepper">Salt & Pepper</SelectItem>
                            <SelectItem value="periodic">Periodic Noise</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="noise-density">Noise Density</Label>
                          <span className="text-sm text-muted-foreground">10%</span>
                        </div>
                        <Slider 
                          id="noise-density"
                          min={1} 
                          max={50} 
                          step={1} 
                          defaultValue={[10]}
                          disabled={!currentImage}
                        />
                      </div>
                      
                      <Button 
                        className="w-full mt-2" 
                        disabled={!currentImage}
                      >
                        Add Noise
                      </Button>
                    </TabsContent>
                    
                    <TabsContent value="remove" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="filter-type">Filter Type</Label>
                        <Select disabled={!currentImage} defaultValue="median">
                          <SelectTrigger id="filter-type">
                            <SelectValue placeholder="Select filter type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="median">Median Filter</SelectItem>
                            <SelectItem value="notch">Notch Filter</SelectItem>
                            <SelectItem value="band">Band Reject</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="kernel-size">Kernel Size</Label>
                          <span className="text-sm text-muted-foreground">3x3</span>
                        </div>
                        <Slider 
                          id="kernel-size"
                          min={3} 
                          max={9} 
                          step={2} 
                          defaultValue={[3]}
                          disabled={!currentImage}
                        />
                      </div>
                      
                      <Button 
                        className="w-full mt-2" 
                        disabled={!currentImage}
                      >
                        Remove Noise
                      </Button>
                    </TabsContent>
                  </Tabs>
                </TabsContent>
                
                <TabsContent value="fft" className="space-y-4">
                  <div className="space-y-4">
                    <Button 
                      className="w-full" 
                      disabled={!currentImage}
                    >
                      Generate FFT
                    </Button>
                    
                    <Button 
                      className="w-full" 
                      variant="outline"
                      disabled={!currentImage}
                    >
                      Inverse FFT
                    </Button>
                    
                    <div className="text-sm text-muted-foreground mt-2">
                      Click on the image to select points for mask filtering in FFT domain
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
            Reset Image
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Noise
