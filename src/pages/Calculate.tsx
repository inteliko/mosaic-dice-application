import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import ImageUploader from "@/components/ImageUploader";
import { processImage } from "@/utils/imageProcessor";
import Header from "@/components/Header";
import { FileDown, Plus, Minus, FileOutput, Dices, Circle, Square } from "lucide-react";
import DicePreview from "@/components/DicePreview";
import DiceCanvas from "@/components/DiceCanvas";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const MAX_DICE = 10000;
const DEFAULT_SIZE = 50;

// Updated interface to match MosaicSettings and specify theme as a union type
interface Settings {
  gridSize: number | "auto" | "custom";
  gridWidth?: number;
  gridHeight?: number;
  contrast: number;
  useShading: boolean;
  diceSizeMm: number;
  theme?: "black" | "white" | "mixed"; // Updated to match MosaicSettings
  faceColors: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
  };
}

const Calculate = () => {
  const [width, setWidth] = useState<number>(DEFAULT_SIZE);
  const [height, setHeight] = useState<number>(DEFAULT_SIZE);
  const [contrast, setContrast] = useState<number>(50);
  const [brightness, setBrightness] = useState<number>(50);
  const [diceGrid, setDiceGrid] = useState<number[][]>([]);
  const [diceCount, setDiceCount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [dicePrice, setDicePrice] = useState<number>(0.10);
  const [settings, setSettings] = useState<Settings>({
    gridSize: DEFAULT_SIZE,
    contrast: 50,
    useShading: true,
    diceSizeMm: 1.6,
    faceColors: {
      1: "#FFFFFF",
      2: "#DDDDDD",
      3: "#BBBBBB",
      4: "#888888",
      5: "#555555",
      6: "#222222",
    }
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [outputDialogOpen, setOutputDialogOpen] = useState<boolean>(false);
  
  // New state for dice theme, replacing invertColors
  const [diceTheme, setDiceTheme] = useState<"mixed" | "black" | "white">("mixed");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { toast } = useToast();

  // Calculate counts of each dice face
  const diceColorCounts = diceGrid.reduce((acc, row) => {
    row.forEach(value => {
      acc[value] = (acc[value] || 0) + 1;
    });
    return acc;
  }, {} as Record<number, number>);

  // Count black and white dice (faces 1 and 6)
  const whiteDiceCount = diceColorCounts[1] || 0;
  const blackDiceCount = diceColorCounts[6] || 0;

  // Calculate actual dice count from the processed grid
  const actualDiceCount = diceGrid.length > 0 ? diceGrid.length * diceGrid[0].length : width * height;
  
  // Calculate total cost using actual dice count
  const totalCost = (actualDiceCount * dicePrice).toFixed(2);

  // Handle price input change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setDicePrice(value);
    }
  };

  const processCurrentImage = async () => {
    if (!imageFile) {
      toast({
        title: "No image selected",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      toast({
        title: "Processing image",
        description: "Please wait while we convert your image to dice...",
      });
      
      // Use theme instead of invertColors for image processing
      const invertColors = diceTheme === "black";
      
      // Use width and height for the custom grid size
      const grid = await processImage(
        imageFile, 
        "custom", 
        contrast, 
        width, 
        height, 
        brightness, 
        invertColors
      );
      
      setDiceGrid(grid);
      
      // Count dice
      const totalDice = grid.length * grid[0].length;
      setDiceCount(totalDice);
      
      // Update settings with correctly typed values and theme
      setSettings(prev => ({
        ...prev,
        gridSize: "custom" as const,
        gridWidth: width,
        gridHeight: height,
        contrast,
        diceSizeMm: 1.6,
        theme: diceTheme, // Add the theme to settings
      }));
      
      toast({
        title: "Image processed successfully",
        description: `Your image has been converted to a dice mosaic pattern with ${totalDice} dice.`,
      });
    } catch (error) {
      console.error("Image processing error:", error);
      toast({
        title: "Error processing image",
        description: "There was an error processing your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Always reset the processing state, whether successful or not
      setIsProcessing(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    // Check if this is a real file (not an empty file used for clearing)
    if (file.size > 0) {
      setImageFile(file);
      
      try {
        // Start processing indicator
        setIsProcessing(true);
        
        // Process the image immediately after upload
        await processCurrentImage();
      } catch (error) {
        console.error("Error in image upload handler:", error);
        toast({
          title: "Upload error",
          description: "There was a problem processing your image. Please try again.",
          variant: "destructive",
        });
      } finally {
        // Always ensure processing state is reset
        setIsProcessing(false);
      }
    } else {
      // Clear the current image if an empty file was provided
      setImageFile(null);
      setDiceGrid([]);
    }
  };

  const increaseSize = () => {
    if (width * height < MAX_DICE) {
      setWidth(prev => Math.min(prev + 10, 100));
      setHeight(prev => Math.min(prev + 10, 100));
    } else {
      toast({
        title: "Maximum size reached",
        description: `You cannot exceed ${MAX_DICE} dice in total.`,
        variant: "destructive",
      });
    }
  };

  const decreaseSize = () => {
    setWidth(prev => Math.max(prev - 10, 10));
    setHeight(prev => Math.max(prev - 10, 10));
  };

  const increaseContrast = () => {
    setContrast(prev => Math.min(prev + 10, 100));
  };

  const decreaseContrast = () => {
    setContrast(prev => Math.max(prev - 10, 0));
  };

  const increaseBrightness = () => {
    setBrightness(prev => Math.min(prev + 10, 100));
  };

  const decreaseBrightness = () => {
    setBrightness(prev => Math.max(prev - 10, 0));
  };

  // Handle theme change
  const handleThemeChange = (value: string) => {
    if (value === "black" || value === "white" || value === "mixed") {
      setDiceTheme(value);
      
      // Automatically process image if one is loaded
      if (imageFile && !isProcessing) {
        processCurrentImage();
      }
      
      toast({
        title: `${value.charAt(0).toUpperCase() + value.slice(1)} Dice Theme`,
        description: `Switched to ${value} dice theme`,
      });
    }
  };

  const openOutput = () => {
    if (diceGrid.length === 0) {
      toast({
        title: "No dice mosaic generated",
        description: "Please upload an image and generate a dice mosaic first.",
        variant: "destructive",
      });
      return;
    }
    
    setOutputDialogOpen(true);
    toast({
      title: "Output opened",
      description: "Showing dice layout for printing.",
    });
  };

  const downloadCSV = () => {
    if (diceGrid.length === 0) return;
    
    const headers = ["Row", "Column", "Dice Value"];
    const csvRows = [headers];

    diceGrid.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        csvRows.push([String(rowIndex + 1), String(colIndex + 1), String(value)]);
      });
    });

    const csvContent = csvRows
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dice-mosaic.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download started",
      description: "Your dice mosaic CSV has been downloaded.",
    });
  };

  const downloadPNG = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    
    // Create a high-resolution version for download
    const downloadCanvas = document.createElement("canvas");
    const ctx = downloadCanvas.getContext("2d");
    if (!ctx) return;
    
    // Set higher resolution for download
    const scaleFactor = 2; // Double resolution for downloads
    downloadCanvas.width = canvas.width * scaleFactor;
    downloadCanvas.height = canvas.height * scaleFactor;
    
    // Draw with high quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      canvas, 
      0, 0, canvas.width, canvas.height,
      0, 0, downloadCanvas.width, downloadCanvas.height
    );
    
    // Generate high-quality PNG
    const dataUrl = downloadCanvas.toDataURL("image/png", 1.0);
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "dice-mosaic.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Your high-resolution dice mosaic image has been downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">
          Dice mosaic generator (prepare your image to recreate it using only dice)
        </h1>

        <div className="max-w-4xl mx-auto">
          {/* Top Section: Controls */}
          <Card className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x">
              {/* Image Upload */}
              <div className="p-4">
                <Label className="text-lg font-medium mb-4 block">Image</Label>
                <ImageUploader onImageUpload={handleImageUpload} id="imageUploader" />
                
                {/* Generate Mosaic Button */}
                <Button 
                  variant="default" 
                  className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={processCurrentImage}
                  disabled={!imageFile || isProcessing}
                >
                  <Dices className="w-4 h-4 mr-2" />
                  Generate Mosaic
                </Button>
              </div>

              {/* Desired Size */}
              <div className="p-4">
                <Label className="text-lg font-medium mb-4 block">Desired Size</Label>
                
                <div className="flex gap-2 mb-4">
                  <Button 
                    variant="default" 
                    className="bg-blue-500 hover:bg-blue-600 text-white flex-1 min-w-0"
                    onClick={decreaseSize}
                    disabled={isProcessing}
                  >
                    <Minus size={16} /> <span className="truncate">Decrease</span>
                  </Button>
                  
                  <Button 
                    variant="default" 
                    className="bg-blue-500 hover:bg-blue-600 text-white flex-1 min-w-0"
                    onClick={increaseSize}
                    disabled={isProcessing}
                  >
                    <Plus size={16} /> <span className="truncate">Increase</span>
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Label className="w-16">Width</Label>
                    <Input 
                      type="number" 
                      value={width} 
                      onChange={e => {
                        const newWidth = Math.min(parseInt(e.target.value) || 10, 100);
                        setWidth(newWidth);
                      }} 
                      className="w-24" 
                      disabled={isProcessing}
                    />
                    <span className="ml-2">cm</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Label className="w-16">Height</Label>
                    <Input 
                      type="number" 
                      value={height} 
                      onChange={e => {
                        const newHeight = Math.min(parseInt(e.target.value) || 10, 100);
                        setHeight(newHeight);
                      }} 
                      className="w-24" 
                      disabled={isProcessing}
                    />
                    <span className="ml-2">cm</span>
                  </div>
                </div>
              </div>

              {/* Cost Estimate */}
              <div className="p-4">
                <Label className="text-lg font-medium mb-4 block">Cost Estimate (16mm)</Label>
                
                <div className="mb-4">
                  <p>{actualDiceCount} Dice @</p>
                </div>
                
                <div className="flex items-center mb-4">
                  <span className="mr-2">$</span>
                  <Input 
                    type="number" 
                    value={dicePrice.toFixed(2)} 
                    onChange={handlePriceChange}
                    className="w-16"
                    step="0.01"
                    min="0"
                  />
                </div>
                
                <div className="font-medium">
                  = ${totalCost}
                </div>
              </div>

              {/* Export */}
              <div className="p-4">
                <Label className="text-lg font-medium mb-4 block">Export</Label>
                
                {/* Replace checkbox with toggle group for theme selection */}
                <div className="mb-4">
                  <Label className="text-sm mb-2 block">Dice Theme</Label>
                  <ToggleGroup 
                    type="single" 
                    value={diceTheme}
                    onValueChange={handleThemeChange}
                    className="justify-start"
                  >
                    <ToggleGroupItem 
                      value="black" 
                      aria-label="Black dice"
                      className="flex items-center gap-1 px-2 py-1 text-xs"
                    >
                      <Square className="w-3 h-3" /> Black
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="white" 
                      aria-label="White dice"
                      className="flex items-center gap-1 px-2 py-1 text-xs"
                    >
                      <Circle className="w-3 h-3" /> White
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="mixed" 
                      aria-label="Mixed dice"
                      className="flex items-center gap-1 px-2 py-1 text-xs"
                    >
                      <Dices className="w-3 h-3" /> Mixed
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                
                <Button 
                  variant="default" 
                  className="bg-blue-300 hover:bg-blue-400 text-white w-full"
                  onClick={openOutput}
                  disabled={diceGrid.length === 0}
                >
                  <FileOutput className="w-4 h-4 mr-2" />
                  Open output
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Middle Section: Contrast and Brightness Controls */}
          <Card className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
              {/* Contrast Control */}
              <div className="p-4">
                <Label className="text-lg font-medium mb-4 block">Contrast</Label>
                
                <div className="flex gap-2 mb-4">
                  <Button 
                    variant="default" 
                    className="bg-blue-500 hover:bg-blue-600 text-white flex-1"
                    onClick={decreaseContrast}
                    disabled={isProcessing}
                  >
                    <Minus size={16} /> Decrease
                  </Button>
                  
                  <Button 
                    variant="default" 
                    className="bg-blue-500 hover:bg-blue-600 text-white flex-1"
                    onClick={increaseContrast}
                    disabled={isProcessing}
                  >
                    <Plus size={16} /> Increase
                  </Button>
                </div>
                
                <div className="flex items-center">
                  <Input 
                    type="number" 
                    value={contrast} 
                    onChange={e => {
                      setContrast(parseInt(e.target.value) || 0);
                    }} 
                    className="w-16" 
                    disabled={isProcessing}
                  />
                </div>
              </div>
              
              {/* Brightness Control */}
              <div className="p-4">
                <Label className="text-lg font-medium mb-4 block">Brightness</Label>
                
                <div className="flex gap-2 mb-4">
                  <Button 
                    variant="default" 
                    className="bg-blue-500 hover:bg-blue-600 text-white flex-1"
                    onClick={decreaseBrightness}
                    disabled={isProcessing}
                  >
                    <Minus size={16} /> Decrease
                  </Button>
                  
                  <Button 
                    variant="default" 
                    className="bg-blue-500 hover:bg-blue-600 text-white flex-1"
                    onClick={increaseBrightness}
                    disabled={isProcessing}
                  >
                    <Plus size={16} /> Increase
                  </Button>
                </div>
                
                <div className="flex items-center">
                  <Input 
                    type="number" 
                    value={brightness} 
                    onChange={e => {
                      setBrightness(parseInt(e.target.value) || 0);
                    }} 
                    className="w-16" 
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>
          </Card>
          
          {/* Preview Area */}
          <div className="mb-4">
            {diceGrid.length === 0 ? (
              <div className="h-64 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2RkZCIvPgo8cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2RkZCIvPgo8L3N2Zz4=')] flex items-center justify-center rounded-lg">
                <p className="text-sm text-gray-500">Upload an image and generate a dice mosaic to see the preview</p>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg border">
                <DiceCanvas
                  diceGrid={diceGrid}
                  settings={settings}
                  onCanvasReady={(canvas) => {
                    canvasRef.current = canvas;
                  }}
                />
                <div className="mt-4 text-center">
                  <Button 
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={downloadPNG}
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    Generate PNG
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Instructions */}
          <Card className="p-6 mb-4">
            <h2 className="text-xl font-bold mb-4">How to Use</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Upload your image</li>
              <li>Adjust size, contrast, and brightness</li>
              <li>Open output for a printable list of dice numbers</li>
            </ol>
          </Card>
        </div>
      </div>

      {/* Output Dialog */}
      <Dialog open={outputDialogOpen} onOpenChange={setOutputDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Dice Mosaic Output</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            <div className="flex flex-col space-y-4">
              <div className="border rounded-md p-4 bg-white">
                <DiceCanvas
                  diceGrid={diceGrid}
                  settings={settings}
                  onCanvasReady={() => {}}
                />
              </div>
              
              {/* Mosaic Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold mb-2">Dimensions</h3>
                  <p>Width: {diceGrid[0]?.length || width} dice</p>
                  <p>Height: {diceGrid.length || height} dice</p>
                  <p>Total dice: {actualDiceCount}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold mb-2">Dice Distribution</h3>
                  <p>White dice (1): {diceColorCounts[1] || 0}</p>
                  <p>Black dice (6): {diceColorCounts[6] || 0}</p>
                  <p>Total cost: ${totalCost}</p>
                </div>
              </div>
              
              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={downloadPNG}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Download Image
                </Button>
                
                <Button 
                  onClick={downloadCSV}
                  variant="outline"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
              </div>
              
              <div className="text-sm text-gray-500 text-center">
                <p>The CSV file contains the position and value of each dice for manual assembly.</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calculate;
