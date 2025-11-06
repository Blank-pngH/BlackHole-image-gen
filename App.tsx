import React, { useState, useCallback, useRef, useEffect } from 'react';
import { generateImage } from './services/geminiService';
import { PromptForm } from './components/PromptForm';
import { ImageDisplay } from './components/ImageDisplay';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const imageDisplayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageUrl && imageDisplayRef.current) {
      setTimeout(() => {
        imageDisplayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [imageUrl]);

  const handleGenerateImage = useCallback(async () => {
    if (!prompt || isLoading) return;

    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const generatedImageUrl = await generateImage(prompt);
      setImageUrl(generatedImageUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error("Error generating image:", errorMessage);
      setError(`Failed to generate image. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading]);

  return (
    <div 
      className="flex flex-col min-h-screen bg-black text-gray-100 font-sans"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, hsl(260, 50%, 15%), #000 75%)' }}
    >
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8">
          
          <div className="lg:w-1/2 flex flex-col space-y-6">
            <div className="bg-black/50 p-6 rounded-2xl shadow-lg border border-indigo-900/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 mb-4">
                Describe Your Vision
              </h2>
              <p className="text-gray-400 mb-6">
                Enter a detailed prompt to bring your idea to life. The more descriptive you are, the better the result.
              </p>
              <PromptForm
                prompt={prompt}
                setPrompt={setPrompt}
                onSubmit={handleGenerateImage}
                isLoading={isLoading}
              />
            </div>
          </div>

          <div className="lg:w-1/2">
            <ImageDisplay 
              ref={imageDisplayRef}
              imageUrl={imageUrl} 
              isLoading={isLoading} 
              error={error} 
              prompt={prompt}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;