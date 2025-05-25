"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageDisplay } from "@/components/editor/ImageDisplay"
import { HistogramChart } from "@/components/editor/HistogramChart"
import { usePhotoStore } from "@/store/photo-store"
import { LineChart, BarChart } from "lucide-react"
import { generateHistogram, equalizeHistogram } from "@/lib/api"
import { toast } from "sonner"

interface HistogramData {
  histograms: {
    r: number[];
    g: number[];
    b: number[];
  };
  cumulative_histograms: {
    r: number[];
    g: number[];
    b: number[];
  };
}

interface EqualizeResponse {
  message: string;
  original_image: string;
  equalized_image: string;
  original_histograms: {
    r: number[];
    g: number[];
    b: number[];
  };
  equalized_histograms: {
    r: number[];
    g: number[];
    b: number[];
  };
}

const Histogram = () => {
  const { currentImage, imageName } = usePhotoStore()
  const [histogramData, setHistogramData] = useState<HistogramData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showCumulative, setShowCumulative] = useState(false)

  const handleGenerateHistogram = async () => {
    if (!imageName) return

    setIsLoading(true)
    try {
      console.log('Image name:', imageName)
      const data = await generateHistogram(imageName)
      console.log('Histogram data:', data)
      setHistogramData(data)
      toast.success("Histogram generated successfully")
    } catch (error) {
      console.error('Histogram generation error:', error)
      toast.error(error instanceof Error ? error.message : "Failed to generate histogram")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEqualizeHistogram = async () => {
    if (!imageName) return

    setIsLoading(true)
    try {
      const response = await equalizeHistogram(imageName) as EqualizeResponse
      console.log('Equalize response:', response)
      
      // Create a HistogramData object from the equalized histograms
      const histogramData: HistogramData = {
        histograms: response.equalized_histograms,
        cumulative_histograms: {
          r: response.equalized_histograms.r.map((_, i, arr) => 
            arr.slice(0, i + 1).reduce((sum, val) => sum + val, 0)
          ),
          g: response.equalized_histograms.g.map((_, i, arr) => 
            arr.slice(0, i + 1).reduce((sum, val) => sum + val, 0)
          ),
          b: response.equalized_histograms.b.map((_, i, arr) => 
            arr.slice(0, i + 1).reduce((sum, val) => sum + val, 0)
          )
        }
      }
      
      setHistogramData(histogramData)
      toast.success("Histogram equalized successfully")
    } catch (error) {
      console.error('Equalize error:', error)
      toast.error(error instanceof Error ? error.message : "Failed to equalize histogram")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Histogram Analysis</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 h-[500px]">
          <ImageDisplay />
        </div>
        
        <div className="space-y-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-base text-gray-900 dark:text-gray-100">Histogram Functions</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3 space-y-4">
              <Button 
                variant="outline" 
                disabled={!currentImage || isLoading} 
                onClick={handleGenerateHistogram}
                className="w-full flex items-center gap-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <BarChart className="h-4 w-4" />
                <span>Generate Histogram</span>
              </Button>
              
              <Button 
                variant="outline" 
                disabled={!currentImage || isLoading} 
                onClick={handleEqualizeHistogram}
                className="w-full flex items-center gap-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LineChart className="h-4 w-4" />
                <span>Equalize Histogram</span>
              </Button>

              {histogramData && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowCumulative(!showCumulative)}
                  className="w-full flex items-center gap-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span>{showCumulative ? "Show Regular" : "Show Cumulative"}</span>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-base text-gray-900 dark:text-gray-100">Histogram Chart</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3">
              {isLoading ? (
                <div className="h-40 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                  Processing...
                </div>
              ) : histogramData ? (
                <div className="h-40">
                  <HistogramChart data={histogramData} showCumulative={showCumulative} />
                </div>
              ) : currentImage ? (
                <div className="h-40 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                  Click &quot;Generate Histogram&quot; to view the histogram
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
