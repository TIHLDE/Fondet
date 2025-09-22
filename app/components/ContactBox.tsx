export default function ContactBox() {
  return (
    <div className="bg-[hsl(217,62%,12%)] border border-[hsl(217,62%,20%)] rounded-lg p-8 shadow-lg">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Kontakt forvaltningsgruppen
      </h2>
      
      <div className="space-y-4">
        <p className="text-gray-300 text-lg leading-relaxed">
          Har du spørsmål om TIHLDE-fondet eller trenger hjelp med søknaden?
        </p>
        
        <div className="bg-[hsl(217,62%,8%)] border border-[hsl(217,62%,20%)] rounded-md p-4">
          <p className="text-gray-300 mb-3 font-medium">
            Ta kontakt med forvaltningsgruppen:
          </p>
          <a 
            href="mailto:forvalter@tihlde.org" 
            className="text-blue-400 hover:text-blue-300 font-semibold text-lg transition-colors"
          >
            forvalter@tihlde.org
          </a>
        </div>
      </div>
    </div>
  )
}
