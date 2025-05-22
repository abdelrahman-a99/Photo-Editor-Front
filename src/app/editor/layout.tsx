import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Photo Editor - Basic Editing",
  description: "Basic photo editing tools including brightness, contrast, and saturation adjustments",
}

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 