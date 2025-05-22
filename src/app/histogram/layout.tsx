import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Histogram Analysis",
  description: "Analyze and equalize image histograms for better contrast and exposure",
}

export default function HistogramLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 