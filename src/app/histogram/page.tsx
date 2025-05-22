"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageDisplay } from "@/components/editor/ImageDisplay"
import { usePhotoStore } from "@/store/photo-store"
import { LineChart, BarChart } from "lucide-react"

const Histogram = () => {
  const { currentImage } = usePhotoStore()

  return (
    <div className="container mx-auto py-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Histogram Analysis</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 h-[500px]">
          <ImageDisplay />
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-base text-gray-900 dark:text-gray-100">Histogram Functions</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3 space-y-4">
              <Button 
                variant="outline" 
                disabled={!currentImage} 
                className="w-full flex items-center gap-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <BarChart className="h-4 w-4" />
                <span>Generate Histogram</span>
              </Button>
              
              <Button 
                variant="outline" 
                disabled={!currentImage} 
                className="w-full flex items-center gap-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LineChart className="h-4 w-4" />
                <span>Equalize Histogram</span>
              </Button>
            </CardContent>
          </Card>

          <Card className="min-h-[200px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-base text-gray-900 dark:text-gray-100">Histogram Chart</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3">
              {currentImage ? (
                <div className="h-40 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                  Histogram will appear here after processing
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                  Upload an image to view histogram
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Histogram
