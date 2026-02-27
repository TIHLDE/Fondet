export default function ContactBox() {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/30 backdrop-blur-sm p-6 shadow-lg">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Kontakt forvaltningsgruppen
      </h2>

      <div className="space-y-4">
        <p className="text-foreground-secondary text-lg leading-relaxed">
          Har du spørsmål om TIHLDE-fondet eller trenger hjelp med søknaden?
        </p>
          <p className="text-foreground-secondary mb-3 font-medium">
            Ta kontakt med fondsforvalter:
          </p>
          <a
            href="mailto:forvalter@tihlde.org"
            className="text-accent hover:text-accent/80 font-semibold text-lg transition-colors"
          >
            forvalter@tihlde.org
          </a>
      </div>
    </div>
  );
}
