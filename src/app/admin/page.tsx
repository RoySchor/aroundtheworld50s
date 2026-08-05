import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

const HELPFUL_LINKS = [
  {
    url: "https://vercel.com/royschors-projects",
    label: "Vercel",
    description: "המקום שבו האתר מתארח",
  },
  {
    url: "https://supabase.com/dashboard/project/dxaqpznrwbkhosjlkelw",
    label: "Supabase",
    description: "ה-database שלך",
  },
  {
    url: "https://analytics.google.com/analytics/web/?utm_source=OGB&utm_medium=app&authuser=1#/a385237327p533022527/reports/start?params=_u..nav%3Dmaui",
    label: "Google Analytics",
    description: "עמוד Google Analytics",
  },
  {
    url: "https://github.com/RoySchor/aroundtheworld50s",
    label: "GitHub",
    description: "Github Repository",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div
        dir="rtl"
        className="max-w-2xl bg-white rounded-2xl shadow-md p-10 text-right text-gray-700 leading-loose text-lg"
      >
        <p className="text-3xl font-semibold mb-5">שלום אמא,</p>

        <p className="text-xl mb-5">
          שימי לב כשאת עורכת כאן — את עורכת ישירות את מסד הנתונים (backend). אין לי טבלאות גרסאות,
          כך שכל שינוי או מחיקה אינם נשמרים כהיסטוריה. ברגע ששומרים את העריכות, הן סופיות ולא ניתן
          לשחזר את המצב הקודם.
        </p>

        <p className="text-xl mb-8">תהני מהאתר, ועדכני אותי אם את נתקלת בבאגים.</p>

        <p className="text-2xl font-semibold mb-4">קישורים שימושיים:</p>
        <ul className="list-disc pr-6 space-y-3">
          {HELPFUL_LINKS.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-accent hover:underline font-medium"
              >
                {link.label}
              </a>
              <ul className="list-disc pr-6 mt-1 font-medium">
                <li className="text-gray-500 text-base">{link.description}</li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
