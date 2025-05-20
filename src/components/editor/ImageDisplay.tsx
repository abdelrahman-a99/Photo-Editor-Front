import { usePhotoStore } from "@/store/photo-store"
import { Card } from "@/components/ui/card"
import { ImageIcon } from "lucide-react"

export const ImageDisplay = () => {
  const { currentImage } = usePhotoStore()
  
  return (
    <Card className="flex-1 p-1 min-h-[300px] h-full overflow-hidden">
      {currentImage ? (
        <div className="relative w-full h-full flex items-center justify-center bg-black/5 rounded-sm">
          <img 
            src={currentImage} 
            alt="Edited photo" 
            className="max-h-full max-w-full object-contain"
          />
        </div>
      ) : (
        <div className="placeholder-preview flex-col">
          <ImageIcon className="h-10 w-10 mb-2 opacity-30" />
          <p>Upload an image to get started</p>
        </div>
      )}
    </Card>
  )
}
