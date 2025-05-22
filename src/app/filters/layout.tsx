import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Photo Editor - Image Filters",
  description: "Apply various image filters including Sobel, Laplacian, and Gaussian blur",
}

export default function FiltersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 