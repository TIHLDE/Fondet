import Link from "next/link";
import ContactBox from "../../components/ContactBox";

export default function Apply() {
  return (
    <div className="min-h-screen bg-gradient-primary">
      <main className="flex flex-col items-center justify-center sm:px-8 sm:pb-8 pt-24">
        <div className="text-center mb-8 px-4 sm:px-0 pt-8 sm:pt-8">
          <h1 className="text-4xl font-bold text-foreground mb-8">
            Søk om støtte
          </h1>
        </div>

        {/* Information Box */}
        <div className="w-full max-w-6xl mx-auto px-0 sm:px-0 mb-6">
          <div className="bg-[hsl(217,62%,12%)] border border-[hsl(217,62%,20%)] rounded-lg p-6 sm:p-8 shadow-lg">
            <div className="space-y-8">
              {/* Før du søker section */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">
                  Før du søker
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  Det finnes et utall forskjellige støtteordninger som
                  administreres av ulike organisasjoner. Vi ber deg derfor sette
                  deg inn i hvilke andre støtteordninger som finnes, og søke der
                  det kan være muligheter før du søker støtte fra TIHLDE-fondet.
                  Oversikten over andre plasser kan finnes her. Dersom du ikke
                  får støtte andre steder, eller ditt initiativ ikke rimelig kan
                  dekkes av noen andre støtteordninger er du velkommen til å
                  søke støtte fra oss.
                </p>
              </div>

              {/* Hvordan søke om støtte section */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">
                  Hvordan søke om støtte
                </h2>
                <p className="text-gray-300 mb-4">
                  Kravene en søknad må oppfylle er følgende:
                </p>

                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>Kun medlemmer av TIHLDE kan søke om støtte.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>
                      Søknad skal inneholde navn på søker, formålet med søknad,
                      ønsket sum og budsjettering for bruk av midlene.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>
                      Søknad skal være begrunnet og ha som mål å kunne gi en
                      positiv avkastning for TIHLDEs medlemmer.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>
                      <strong>Minimumsbeløp:</strong> 5000 kr. For beløp som er
                      mindre enn dette kan du spørre hs@tihlde.org.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>
                      <strong>Maksimumsbeløp:</strong> 100 000 kr. Beløp som
                      overstiger dette kan ikke behandles internt, og må vedtas
                      av generalforsamlingen.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>
                      Fondet skal kun brukes til investeringer/kjøp som
                      linjeforeningen ikke har budsjettert for.
                    </span>
                  </li>
                </ul>

                <p className="text-gray-300 mt-6 leading-relaxed">
                  Du kan enten bruke søknadsmalen eller fylle ut skjemaet.
                  Husk at du uansett må legge ved et budsjett som
                  viser hvordan midlene skal brukes. Det er også helt i orden å
                  legge ved flere dokumenter om det trengs.
                </p>

                <div className="mt-6 p-4 bg-[hsl(217,62%,8%)] border border-[hsl(217,62%,20%)] rounded-md">
                  <p className="text-gray-300 font-medium">
                    <strong>Søknadsmalen kan lastes ned</strong>{" "}
                    <a
                      href="https://drive.google.com/uc?id=1PNbg_9fVoJzhjtxQ7G3nD__xZ1uOSoHw&export=download"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      her
                    </a>
                  </p>
                </div>
              </div>

              {/* Søk støtte button */}
              <div className="flex justify-center pt-4">
                <Link
                  href="/sok/skjema"
                  className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors text-lg"
                >
                  Søk støtte
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Previous Applications Box */}
        <div className="w-full max-w-6xl mx-auto px-0 sm:px-0 mb-6">
          <div className="bg-[hsl(217,62%,12%)] border border-[hsl(217,62%,20%)] rounded-lg p-6 sm:p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Tidligere søknader
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-[hsl(217,62%,20%)]">
                    <th className="text-left py-3 px-4 text-white font-semibold w-32">
                      Hvem søkte
                    </th>
                    <th className="text-left py-3 px-4 text-white font-semibold w-48">
                      Hva søktes om
                    </th>
                    <th className="text-left py-3 px-4 text-white font-semibold w-24">
                      Når
                    </th>
                    <th className="text-left py-3 px-4 text-white font-semibold w-32">
                      Søkt om
                    </th>
                    <th className="text-left py-3 px-4 text-white font-semibold w-32">
                      Innvilget
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[hsl(217,62%,15%)]">
                    <td className="py-3 px-4 text-gray-300 w-32">
                      Hovedstyret
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-48">Kjøkken</td>
                    <td className="py-3 px-4 text-gray-300 w-24">15.05.2025</td>
                    <td className="py-3 px-4 text-gray-300 w-32">
                      <a
                        href="https://drive.google.com/file/d/1ntj1CTeBvdQlS9A7wbqB82ztLht0b4BA/view?usp=drive_link"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        80 150 kr
                      </a>
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-32">
                      <a
                        href="https://drive.google.com/file/d/109RuXdTPxf80oh7Dx7YmkmKqKdnauT8I/view?usp=drive_link"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        64 120 kr
                      </a>
                    </td>
                  </tr>
                  <tr className="border-b border-[hsl(217,62%,15%)]">
                    <td className="py-3 px-4 text-gray-300 w-32">Sosialen</td>
                    <td className="py-3 px-4 text-gray-300 w-48">
                      Utmatrikuleringsball
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-24">12.02.2025</td>
                    <td className="py-3 px-4 text-gray-300 w-32">
                      <a
                        href="https://drive.google.com/file/d/1lTnpw6IlnvrYhGeY-y6k68E7Ql52ADxc/view?usp=drive_link"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        18 000 kr
                      </a>
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-32">
                      <a
                        href="https://drive.google.com/file/d/17114ru4Bah5wTGje-mXqDGCsm6ybYN1Z/view?usp=drive_link"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        6 000 kr
                      </a>
                    </td>
                  </tr>
                  <tr className="border-b border-[hsl(217,62%,15%)]">
                    <td className="py-3 px-4 text-gray-300 w-32">
                      TIHLDE Pythons Herrer
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-48">
                      Påmeldingsavgift
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-24">28.08.2024</td>
                    <td className="py-3 px-4 text-gray-300 w-32">
                      <a
                        href="https://drive.google.com/file/d/1rZ9hJ4cmOveQfBAYiuY88phxIV0H0gsV/view?usp=drive_link"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        19 800 kr
                      </a>
                    </td>
                    <td className="py-3 px-4 text-red-400 w-32">
                      <a
                        href="https://drive.google.com/file/d/1fq_PAHbBx4vM8PP_WdDcwzOF_lcFNV4k/view?usp=drive_link"
                        className="text-red-400 hover:text-red-300"
                      >
                        Avslått
                      </a>
                    </td>
                  </tr>
                  <tr className="border-b border-[hsl(217,62%,15%)]">
                    <td className="py-3 px-4 text-gray-300 w-32">
                      TIHLDE Klatring
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-48">
                      Søtte til klatreutstyr
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-24">09.11.2023</td>
                    <td className="py-3 px-4 text-gray-300 w-32">
                      <a
                        href="https://drive.google.com/file/d/1Y6iaCTCAL1OI1uQ4S60UpXoSbMQCtYPr/view?usp=sharing"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        6 000 kr
                      </a>
                    </td>
                    <td className="py-3 px-4 text-green-400">
                      <a
                        href="https://drive.google.com/file/d/1GXYpcmG81L0eCOwNhSRfjeM7kz_Gurbm/view?usp=sharing"
                        className="text-green-400 hover:text-green-300"
                      >
                        6 000 kr
                      </a>
                    </td>
                  </tr>
                  <tr className="border-b border-[hsl(217,62%,15%)]">
                    <td className="py-3 px-4 text-gray-300 w-32">Sosialen</td>
                    <td className="py-3 px-4 text-gray-300 w-48">
                      Støtte til julebord
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-24">12.10.2023</td>
                    <td className="py-3 px-4 text-gray-300 w-32">
                      <a
                        href="https://drive.google.com/file/d/15hFwKChu8wGsuuICddP7vDnXTiDEK4x5/view?usp=sharing"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        60 241 kr
                      </a>
                    </td>
                    <td className="py-3 px-4 text-red-400">
                      <a
                        href="https://drive.google.com/file/d/1yQvQ5Nzz4G6GLczW7-xrcUU37fRJ7hVY/view?usp=sharing"
                        className="text-red-400 hover:text-red-300"
                      >
                        Avslått
                      </a>
                    </td>
                  </tr>
                  <tr className="border-b border-[hsl(217,62%,15%)]">
                    <td className="py-3 px-4 text-gray-300 w-32">
                      TIHLDE Klatring
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-48">
                      Klatrearrangement, Brattkort og utstyr
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-24">04.10.2023</td>
                    <td className="py-3 px-4 text-gray-300 w-32">
                      <a
                        href="https://drive.google.com/file/d/1iDqVY6KlnDqhZaTcdFcIPvS7tDUBG_Fy/view?usp=share_link"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        21 000 kr
                      </a>
                    </td>
                    <td className="py-3 px-4 text-red-400">
                      <a
                        href="https://drive.google.com/file/d/1ET0wv0zDGKJ6mFI36XFp6_RcHY9GVa9G/view?usp=sharing"
                        className="text-red-400 hover:text-red-300"
                      >
                        Avslått
                      </a>
                    </td>
                  </tr>
                  <tr className="border-b border-[hsl(217,62%,15%)]">
                    <td className="py-3 px-4 text-gray-300 w-32">
                      TIHLDE Pythons Herrer
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-48">
                      Nye fotballer
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-24">26.09.2023</td>
                    <td className="py-3 px-4 text-gray-300 w-32">
                      <a
                        href="https://drive.google.com/file/d/1Rc6fiIgSq7342fKGYi9Si_7ZFZyb9dVd/view?usp=drive_link"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        10 000 kr
                      </a>
                    </td>
                    <td className="py-3 px-4 text-green-400">
                      <a
                        href="https://drive.google.com/file/d/1Rc6fiIgSq7342fKGYi9Si_7ZFZyb9dVd/view?usp=drive_link"
                        className="text-green-400 hover:text-green-300"
                      >
                        10 000 kr
                      </a>
                    </td>
                  </tr>
                  <tr className="border-b border-[hsl(217,62%,15%)]">
                    <td className="py-3 px-4 text-gray-300 w-32">
                      Redaksjonen
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-48">
                      Extra utgave av TÖDDEL
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-24">31.05.2023</td>
                    <td className="py-3 px-4 text-gray-300 w-32">
                      <a
                        href="https://drive.google.com/open?id=1cTwhA7kIEkMpLQG5BQrrzuDFjGUHR4IW&usp=drive_copy"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        8 750 kr
                      </a>
                    </td>
                    <td className="py-3 px-4 text-green-400">
                      <a
                        href="https://drive.google.com/open?id=1xKRsiRBs1_UoqgObo-r7dRPksCE2izfc&usp=drive_copy"
                        className="text-green-400 hover:text-green-300"
                      >
                        8 750 kr
                      </a>
                    </td>
                  </tr>
                  <tr className="border-b border-[hsl(217,62%,15%)]">
                    <td className="py-3 px-4 text-gray-300 w-32">TIHLDE ski</td>
                    <td className="py-3 px-4 text-gray-300 w-48">
                      Merch for medlemmer
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-24">15.04.2023</td>
                    <td className="py-3 px-4 text-gray-300 w-32">
                      <a
                        href="https://drive.google.com/file/d/1iDXNkcLdKW78D3ewCQH6r7TzYMfx7Yl9/view?usp=share_link"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        3 000 kr
                      </a>
                    </td>
                    <td className="py-3 px-4 text-red-400">
                      <a
                        href="https://drive.google.com/file/d/1TLFCPgBNrFmveHlpNF2TN9XehjTORIso/view?usp=share_link"
                        className="text-red-400 hover:text-red-300"
                      >
                        Avslått
                      </a>
                    </td>
                  </tr>
                  <tr className="border-b border-[hsl(217,62%,15%)]">
                    <td className="py-3 px-4 text-gray-300 w-32">JubKom</td>
                    <td className="py-3 px-4 text-gray-300 w-48">
                      Prisreduksjon gallabilletter
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-24">05.03.2023</td>
                    <td className="py-3 px-4 text-gray-300 w-32">
                      <a
                        href="https://drive.google.com/file/d/1JOnuCaGeAwLSlTbHTrSGM5yCNWk4xYyz/view?usp=share_link"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        45 000 kr
                      </a>
                    </td>
                    <td className="py-3 px-4 text-green-400">
                      <a
                        href="https://drive.google.com/file/d/13Hj9_Rm4G9yB78vhedX9038_r4QZqc9A/view?usp=share_link"
                        className="text-green-400 hover:text-green-300"
                      >
                        45 000 kr
                      </a>
                    </td>
                  </tr>
                  <tr className="border-b border-[hsl(217,62%,15%)]">
                    <td className="py-3 px-4 text-gray-300 w-32">JubKom</td>
                    <td className="py-3 px-4 text-gray-300 w-48">
                      Merfinansiering
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-24">02.02.2023</td>
                    <td className="py-3 px-4 text-gray-300 w-32">
                      <a
                        href="https://drive.google.com/file/d/1YcjiUlu5_TWd4ZUbJNml0Cs0_NHP0Rbu/view?usp=share_link"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        60 000 kr
                      </a>
                    </td>
                    <td className="py-3 px-4 text-red-400">
                      <a
                        href="https://drive.google.com/file/d/1beIJZZgyeDivG7yTuiEDc8XwKP3bkt8C/view?usp=share_link"
                        className="text-red-400 hover:text-red-300"
                      >
                        Avslått
                      </a>
                    </td>
                  </tr>
                  <tr className="border-b border-[hsl(217,62%,15%)]">
                    <td className="py-3 px-4 text-gray-300 w-32">
                      TIHLDE Pythons
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-48">
                      Draktsett/treningsutstyr
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-24">03.08.2022</td>
                    <td className="py-3 px-4 text-gray-300 w-32">
                      <a
                        href="https://drive.google.com/file/d/14m1ULrmOaTsw3RHODD9dAFKVuLh5PYY8/view?usp=sharing"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        14 990 kr
                      </a>
                    </td>
                    <td className="py-3 px-4 text-red-400">
                      <a
                        href="https://drive.google.com/file/d/1vCpItaxjHBiePuHKYJSOUEKAMaC8ykng/view?usp=sharing"
                        className="text-red-400 hover:text-red-300"
                      >
                        Avslått
                      </a>
                    </td>
                  </tr>
                  <tr className="border-b border-[hsl(217,62%,15%)]">
                    <td className="py-3 px-4 text-gray-300 w-32">Promo</td>
                    <td className="py-3 px-4 text-gray-300 w-32">
                      Kamerautstyr
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-32">05.06.2022</td>
                    <td className="py-3 px-4 text-gray-300 w-32">
                      <a
                        href="https://drive.google.com/file/d/1XaHta9jJ_1fQDOeWVPnre5BS6ILVd4U-/view?usp=sharing"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        22 366 kr
                      </a>
                    </td>
                    <td className="py-3 px-4 text-green-400">
                      <a
                        href="https://drive.google.com/file/d/16dbMy5bQQLokve3-tS4bLTZ3COj7ajjM/view?usp=sharing"
                        className="text-green-400 hover:text-green-300"
                      >
                        22 366 kr
                      </a>
                    </td>
                  </tr>
                  <tr className="border-b border-[hsl(217,62%,15%)]">
                    <td className="py-3 px-4 text-gray-300 w-32">
                      Hovedstyret
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-32">
                      Soundbokser med bæreseler
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-32">16.02.2022</td>
                    <td className="py-3 px-4 text-gray-300 w-32">
                      <a
                        href="https://drive.google.com/file/d/1yAPBzPhfMj3NZbgiBLJ0w84n462JH2ow/view?usp=sharing"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        24 495 kr
                      </a>
                    </td>
                    <td className="py-3 px-4 text-green-400">
                      <a
                        href="https://drive.google.com/file/d/1e6yCtLxzluyQjsvngmaJUgYu0uxjsd5a/view?usp=sharing"
                        className="text-green-400 hover:text-green-300"
                      >
                        24 495 kr
                      </a>
                    </td>
                  </tr>
                  <tr className="border-b border-[hsl(217,62%,15%)]">
                    <td className="py-3 px-4 text-gray-300 w-32">
                      Hovedstyret
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-32">
                      Ny fane for TIHLDE
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-32">09.11.2021</td>
                    <td className="py-3 px-4 text-gray-300 w-32">
                      <a
                        href="https://drive.google.com/file/d/1aMytRdz-MX7XY7wAjCYLm-M-K-SwFsKG/view?usp=sharing"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        72 000 kr
                      </a>
                    </td>
                    <td className="py-3 px-4 text-red-400">
                      <a
                        href="https://drive.google.com/file/d/1i5rqXiXiE_8cQEKNNPzPF3nwgs1dO8OT/view?usp=sharing"
                        className="text-red-400 hover:text-red-300"
                      >
                        Avslått
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-300 w-32">
                      TIHLDE Pythons
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-32">
                      Nytt draktsett til bruk i studentligaen
                    </td>
                    <td className="py-3 px-4 text-gray-300 w-32">23.09.2021</td>
                    <td className="py-3 px-4 text-gray-300 w-32">
                      <a
                        href="https://drive.google.com/file/d/1P7NbilpTnR6jevfBfIYv40zEDFBpikrJ/view?usp=sharing"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        9 670 kr
                      </a>
                    </td>
                    <td className="py-3 px-4 text-green-400">
                      <a
                        href="https://drive.google.com/file/d/1aAgP1h8ThU4WacNTxX4qKOVLEmEGMfna/view?usp=sharing"
                        className="text-green-400 hover:text-green-300"
                      >
                        9 670 kr
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Contact Box */}
        <div className="w-full max-w-6xl mx-auto px-0 sm:px-0">
          <ContactBox />
        </div>
      </main>
    </div>
  );
}
