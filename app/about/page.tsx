import Navbar from '../components/Navbar'
import ContactBox from '../components/ContactBox'

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-primary">
      <Navbar />
      <main className="flex flex-col items-center justify-center p-0 sm:p-8">
        <div className="text-center mb-12 px-4 sm:px-0">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            About
          </h1>
          <p className="text-lg text-muted-foreground">
            About page content
          </p>
        </div>
        
        {/* Contact Box */}
        <div className="w-full max-w-6xl mx-auto px-0 sm:px-0">
          <ContactBox />
        </div>
      </main>
    </div>
  )
}
