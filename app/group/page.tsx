import Navbar from '../components/Navbar'

export default function Group() {
  return (
    <div className="min-h-screen bg-gradient-primary">
      <Navbar />
      <main className="flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Group
          </h1>
          <p className="text-lg text-muted-foreground">
            Group page content
          </p>
        </div>
      </main>
    </div>
  )
}
