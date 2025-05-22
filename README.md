# Photo Editor

A modern web-based photo editor built with Next.js, React, and Tailwind CSS. This application provides a comprehensive suite of image editing tools with a beautiful and intuitive user interface.

## Features

### Basic Editing
- Brightness, contrast, and saturation adjustments
- Image cropping and rotation
- Image resizing

### Histogram Analysis
- Generate image histograms
- Histogram equalization
- Real-time histogram visualization

### Image Filters
- Sobel edge detection
- Laplacian filter
- Gaussian blur
- Adjustable kernel sizes (3x3, 5x5, 7x7, 9x9)

### Noise & FFT
- Add noise (Salt & Pepper, Periodic)
- Remove noise using various filters:
  - Median filter
  - Notch filter
  - Band reject filter
- FFT (Fast Fourier Transform) analysis
- Frequency domain filtering

## Tech Stack

- **Frontend Framework**: Next.js 15
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Theme**: Dark/Light mode support

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/photo-editor.git
cd photo-editor
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── editor/            # Basic editing tools
│   ├── filters/           # Image filters
│   ├── histogram/         # Histogram analysis
│   ├── noise/             # Noise & FFT tools
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── editor/           # Editor-specific components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── store/               # State management
```

## Usage

1. **Upload an Image**
   - Click the "Upload Image" button or drag and drop an image
   - Supported formats: JPG, PNG, GIF

2. **Basic Editing**
   - Adjust brightness, contrast, and saturation
   - Crop and rotate images
   - Resize images

3. **Histogram Analysis**
   - Generate histograms for image analysis
   - Apply histogram equalization
   - View real-time histogram updates

4. **Apply Filters**
   - Choose from various edge detection filters
   - Adjust kernel sizes for different effects
   - Apply Gaussian blur with customizable intensity

5. **Noise & FFT**
   - Add different types of noise
   - Remove noise using various filters
   - Perform FFT analysis
   - Apply frequency domain filtering

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Lucide Icons](https://lucide.dev/)
