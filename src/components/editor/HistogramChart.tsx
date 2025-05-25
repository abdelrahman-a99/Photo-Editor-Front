import { useEffect, useRef } from 'react'

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

interface HistogramChartProps {
  data: HistogramData;
  showCumulative?: boolean;
}

export const HistogramChart = ({ data, showCumulative = false }: HistogramChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Get the data to display
    const histData = showCumulative ? data.cumulative_histograms : data.histograms

    // Find the maximum value for scaling
    const maxValue = Math.max(
      ...Object.values(histData).flatMap(channel => channel)
    )

    // Set up the drawing area
    const padding = 20
    const graphWidth = canvas.width - (padding * 2)
    const graphHeight = canvas.height - (padding * 2)
    const binWidth = graphWidth / 256

    // Draw the histograms
    const colors = {
      r: 'rgba(255, 0, 0, 0.5)',
      g: 'rgba(0, 255, 0, 0.5)',
      b: 'rgba(0, 0, 255, 0.5)'
    }

    // Draw each channel
    Object.entries(histData).forEach(([channel, values]) => {
      ctx.beginPath()
      ctx.strokeStyle = colors[channel as keyof typeof colors]
      ctx.lineWidth = 1

      values.forEach((value, i) => {
        const x = padding + (i * binWidth)
        const y = canvas.height - padding - ((value / maxValue) * graphHeight)
        
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()
    })

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = '#666'
    ctx.lineWidth = 1

    // X-axis
    ctx.moveTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)

    // Y-axis
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)

    ctx.stroke()

    // Draw labels
    ctx.fillStyle = '#666'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Intensity', canvas.width / 2, canvas.height - 5)
    
    ctx.save()
    ctx.translate(5, canvas.height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.textAlign = 'center'
    ctx.fillText('Frequency', 0, 0)
    ctx.restore()

  }, [data, showCumulative])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ background: 'transparent' }}
    />
  )
} 