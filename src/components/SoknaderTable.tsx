"use client";

import { useState } from "react";

interface Soknad {
  hvem: string;
  hva: string;
  dato: string;
  sokt: { label: string; url: string };
  resultat: { label: string; url: string; innvilget: boolean };
}

const PAGE_SIZE = 8;

const SOKNADER: Soknad[] = [
  {
    hvem: "Hovedstyret",
    hva: "Kjøkken",
    dato: "15.05.2025",
    sokt: {
      label: "80 150 kr",
      url: "https://drive.google.com/file/d/1ntj1CTeBvdQlS9A7wbqB82ztLht0b4BA/view?usp=drive_link",
    },
    resultat: {
      label: "64 120 kr",
      url: "https://drive.google.com/file/d/109RuXdTPxf80oh7Dx7YmkmKqKdnauT8I/view?usp=drive_link",
      innvilget: true,
    },
  },
  {
    hvem: "Sosialen",
    hva: "Utmatrikuleringsball",
    dato: "12.02.2025",
    sokt: {
      label: "18 000 kr",
      url: "https://drive.google.com/file/d/1lTnpw6IlnvrYhGeY-y6k68E7Ql52ADxc/view?usp=drive_link",
    },
    resultat: {
      label: "6 000 kr",
      url: "https://drive.google.com/file/d/17114ru4Bah5wTGje-mXqDGCsm6ybYN1Z/view?usp=drive_link",
      innvilget: true,
    },
  },
  {
    hvem: "TIHLDE Pythons Herrer",
    hva: "Påmeldingsavgift",
    dato: "28.08.2024",
    sokt: {
      label: "19 800 kr",
      url: "https://drive.google.com/file/d/1rZ9hJ4cmOveQfBAYiuY88phxIV0H0gsV/view?usp=drive_link",
    },
    resultat: {
      label: "Avslått",
      url: "https://drive.google.com/file/d/1fq_PAHbBx4vM8PP_WdDcwzOF_lcFNV4k/view?usp=drive_link",
      innvilget: false,
    },
  },
  {
    hvem: "TIHLDE Klatring",
    hva: "Søtte til klatreutstyr",
    dato: "09.11.2023",
    sokt: {
      label: "6 000 kr",
      url: "https://drive.google.com/file/d/1Y6iaCTCAL1OI1uQ4S60UpXoSbMQCtYPr/view?usp=sharing",
    },
    resultat: {
      label: "6 000 kr",
      url: "https://drive.google.com/file/d/1GXYpcmG81L0eCOwNhSRfjeM7kz_Gurbm/view?usp=sharing",
      innvilget: true,
    },
  },
  {
    hvem: "Sosialen",
    hva: "Støtte til julebord",
    dato: "12.10.2023",
    sokt: {
      label: "60 241 kr",
      url: "https://drive.google.com/file/d/15hFwKChu8wGsuuICddP7vDnXTiDEK4x5/view?usp=sharing",
    },
    resultat: {
      label: "Avslått",
      url: "https://drive.google.com/file/d/1yQvQ5Nzz4G6GLczW7-xrcUU37fRJ7hVY/view?usp=sharing",
      innvilget: false,
    },
  },
  {
    hvem: "TIHLDE Klatring",
    hva: "Klatrearrangement, Brattkort og utstyr",
    dato: "04.10.2023",
    sokt: {
      label: "21 000 kr",
      url: "https://drive.google.com/file/d/1iDqVY6KlnDqhZaTcdFcIPvS7tDUBG_Fy/view?usp=share_link",
    },
    resultat: {
      label: "Avslått",
      url: "https://drive.google.com/file/d/1ET0wv0zDGKJ6mFI36XFp6_RcHY9GVa9G/view?usp=sharing",
      innvilget: false,
    },
  },
  {
    hvem: "TIHLDE Pythons Herrer",
    hva: "Nye fotballer",
    dato: "26.09.2023",
    sokt: {
      label: "10 000 kr",
      url: "https://drive.google.com/file/d/1Rc6fiIgSq7342fKGYi9Si_7ZFZyb9dVd/view?usp=drive_link",
    },
    resultat: {
      label: "10 000 kr",
      url: "https://drive.google.com/file/d/1Rc6fiIgSq7342fKGYi9Si_7ZFZyb9dVd/view?usp=drive_link",
      innvilget: true,
    },
  },
  {
    hvem: "Redaksjonen",
    hva: "Extra utgave av TÖDDEL",
    dato: "31.05.2023",
    sokt: {
      label: "8 750 kr",
      url: "https://drive.google.com/open?id=1cTwhA7kIEkMpLQG5BQrrzuDFjGUHR4IW&usp=drive_copy",
    },
    resultat: {
      label: "8 750 kr",
      url: "https://drive.google.com/open?id=1xKRsiRBs1_UoqgObo-r7dRPksCE2izfc&usp=drive_copy",
      innvilget: true,
    },
  },
  {
    hvem: "TIHLDE ski",
    hva: "Merch for medlemmer",
    dato: "15.04.2023",
    sokt: {
      label: "3 000 kr",
      url: "https://drive.google.com/file/d/1iDXNkcLdKW78D3ewCQH6r7TzYMfx7Yl9/view?usp=share_link",
    },
    resultat: {
      label: "Avslått",
      url: "https://drive.google.com/file/d/1TLFCPgBNrFmveHlpNF2TN9XehjTORIso/view?usp=share_link",
      innvilget: false,
    },
  },
  {
    hvem: "JubKom",
    hva: "Prisreduksjon gallabilletter",
    dato: "05.03.2023",
    sokt: {
      label: "45 000 kr",
      url: "https://drive.google.com/file/d/1JOnuCaGeAwLSlTbHTrSGM5yCNWk4xYyz/view?usp=share_link",
    },
    resultat: {
      label: "45 000 kr",
      url: "https://drive.google.com/file/d/13Hj9_Rm4G9yB78vhedX9038_r4QZqc9A/view?usp=share_link",
      innvilget: true,
    },
  },
  {
    hvem: "JubKom",
    hva: "Merfinansiering",
    dato: "02.02.2023",
    sokt: {
      label: "60 000 kr",
      url: "https://drive.google.com/file/d/1YcjiUlu5_TWd4ZUbJNml0Cs0_NHP0Rbu/view?usp=share_link",
    },
    resultat: {
      label: "Avslått",
      url: "https://drive.google.com/file/d/1beIJZZgyeDivG7yTuiEDc8XwKP3bkt8C/view?usp=share_link",
      innvilget: false,
    },
  },
  {
    hvem: "TIHLDE Pythons",
    hva: "Draktsett/treningsutstyr",
    dato: "03.08.2022",
    sokt: {
      label: "14 990 kr",
      url: "https://drive.google.com/file/d/14m1ULrmOaTsw3RHODD9dAFKVuLh5PYY8/view?usp=sharing",
    },
    resultat: {
      label: "Avslått",
      url: "https://drive.google.com/file/d/1vCpItaxjHBiePuHKYJSOUEKAMaC8ykng/view?usp=sharing",
      innvilget: false,
    },
  },
  {
    hvem: "Promo",
    hva: "Kamerautstyr",
    dato: "05.06.2022",
    sokt: {
      label: "22 366 kr",
      url: "https://drive.google.com/file/d/1XaHta9jJ_1fQDOeWVPnre5BS6ILVd4U-/view?usp=sharing",
    },
    resultat: {
      label: "22 366 kr",
      url: "https://drive.google.com/file/d/16dbMy5bQQLokve3-tS4bLTZ3COj7ajjM/view?usp=sharing",
      innvilget: true,
    },
  },
  {
    hvem: "Hovedstyret",
    hva: "Soundbokser med bæreseler",
    dato: "16.02.2022",
    sokt: {
      label: "24 495 kr",
      url: "https://drive.google.com/file/d/1yAPBzPhfMj3NZbgiBLJ0w84n462JH2ow/view?usp=sharing",
    },
    resultat: {
      label: "24 495 kr",
      url: "https://drive.google.com/file/d/1e6yCtLxzluyQjsvngmaJUgYu0uxjsd5a/view?usp=sharing",
      innvilget: true,
    },
  },
  {
    hvem: "Hovedstyret",
    hva: "Ny fane for TIHLDE",
    dato: "09.11.2021",
    sokt: {
      label: "72 000 kr",
      url: "https://drive.google.com/file/d/1aMytRdz-MX7XY7wAjCYLm-M-K-SwFsKG/view?usp=sharing",
    },
    resultat: {
      label: "Avslått",
      url: "https://drive.google.com/file/d/1i5rqXiXiE_8cQEKNNPzPF3nwgs1dO8OT/view?usp=sharing",
      innvilget: false,
    },
  },
  {
    hvem: "TIHLDE Pythons",
    hva: "Nytt draktsett til bruk i studentligaen",
    dato: "23.09.2021",
    sokt: {
      label: "9 670 kr",
      url: "https://drive.google.com/file/d/1P7NbilpTnR6jevfBfIYv40zEDFBpikrJ/view?usp=sharing",
    },
    resultat: {
      label: "9 670 kr",
      url: "https://drive.google.com/file/d/1aAgP1h8ThU4WacNTxX4qKOVLEmEGMfna/view?usp=sharing",
      innvilget: true,
    },
  },
];

export default function SoknaderTable() {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(SOKNADER.length / PAGE_SIZE);
  const visible = SOKNADER.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-cardBorder">
              <th className="text-left py-3 px-4 text-foreground-primary font-semibold w-32">
                Hvem søkte
              </th>
              <th className="text-left py-3 px-4 text-foreground-primary font-semibold w-48">
                Hva søktes om
              </th>
              <th className="text-left py-3 px-4 text-foreground-primary font-semibold w-24">
                Når
              </th>
              <th className="text-left py-3 px-4 text-foreground-primary font-semibold w-32">
                Søkt om
              </th>
              <th className="text-left py-3 px-4 text-foreground-primary font-semibold w-32">
                Innvilget
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((s, i) => (
              <tr
                key={`${page}-${i}`}
                className={
                  i < visible.length - 1 ? "border-b border-cardBorder" : ""
                }
              >
                <td className="py-3 px-4 text-foreground-secondary w-32">
                  {s.hvem}
                </td>
                <td className="py-3 px-4 text-foreground-secondary w-48">
                  {s.hva}
                </td>
                <td className="py-3 px-4 text-foreground-secondary w-24">
                  {s.dato}
                </td>
                <td className="py-3 px-4 w-32">
                  <a
                    href={s.sokt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {s.sokt.label}
                  </a>
                </td>
                <td className="py-3 px-4 w-32">
                  <a
                    href={s.resultat.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      s.resultat.innvilget
                        ? "text-green-400 hover:text-green-300"
                        : "text-red-400 hover:text-red-300"
                    }
                  >
                    {s.resultat.label}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-2 text-sm rounded-md border border-cardBorder text-foreground-secondary hover:text-foreground-primary hover:border-foreground-secondary transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            Forrige
          </button>
          <span className="text-sm text-foreground-secondary">
            Side {page + 1} av {pageCount}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={page >= pageCount - 1}
            className="px-3 py-2 text-sm rounded-md border border-cardBorder text-foreground-secondary hover:text-foreground-primary hover:border-foreground-secondary transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            Neste
          </button>
        </div>
      )}
    </div>
  );
}
