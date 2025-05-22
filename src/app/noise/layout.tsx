import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Noise & FFT",
  description: "Add or remove noise from images and perform FFT analysis for frequency domain processing",
}

export default function NoiseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 