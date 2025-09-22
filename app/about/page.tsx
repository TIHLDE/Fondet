import Navbar from '../components/Navbar'

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-primary">
      <Navbar />
      <main className="flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            About
          </h1>
          <p className="text-lg text-muted-foreground">
            About page content
          </p>
        </div>
      </main>
    </div>
  )
}
