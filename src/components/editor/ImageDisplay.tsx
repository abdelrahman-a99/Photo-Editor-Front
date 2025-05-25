import { usePhotoStore } from "@/store/photo-store"
import { Card } from "@/components/ui/card"
import { ImageIcon } from "lucide-react"

interface ImageDisplayProps {
  image?: string | null;
}

export const ImageDisplay = ({ image }: ImageDisplayProps) => {
  const { currentImage } = usePhotoStore()
  const displayImage = image ?? currentImage
  
  return (
    <Card className="flex-1 p-1 min-h-[300px] h-full overflow-hidden bg-white dark:bg-gray-950">
      {displayImage ? (
        <div className="relative w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-sm">
          <img 
            src={displayImage} 
            alt="Edited photo" 
            className="max-h-full max-w-full object-contain"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <ImageIcon className="h-10 w-10 mb-2 opacity-30" />
          <p>Upload an image to get started</p>
        </div>
      )}
    </Card>
  )
}
