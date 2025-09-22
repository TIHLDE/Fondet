import Navbar from './components/Navbar'
import ContactBox from './components/ContactBox'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-primary">
      <Navbar />
      <main className="flex flex-col items-center justify-center p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground">
            Fondet
          </h1>
        </div>
        
        {/* Two boxes container */}
        <div className="w-full max-w-6xl mx-auto space-y-6">
          {/* First box */}
          <div className="bg-[hsl(217,62%,12%)] border border-[hsl(217,62%,20%)] rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">
              First Box
            </h2>
            <p className="text-gray-300">
              This is placeholder text for the first box. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          
          {/* Contact Box */}
          <ContactBox />
        </div>
      </main>
    </div>
  )
}

