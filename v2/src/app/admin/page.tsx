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
        className="max-w-xl bg-white rounded-2xl shadow-md p-8 text-right text-gray-700 leading-relaxed"
      >
        <p className="text-xl font-semibold mb-4">שלום אמא,</p>

        <p className="mb-4">
          שימי לב כשאת עורכת כאן — את עורכת ישירות את מסד הנתונים (backend). אין
          לי טבלאות גרסאות, כך שכל שינוי או מחיקה אינם נשמרים כהיסטוריה. ברגע
          ששומרים את העריכות, הן סופיות ולא ניתן לשחזר את המצב הקודם.
        </p>

        <p className="mb-6">תהני מהאתר, ועדכני אותי אם את נתקלת בבאגים.</p>

        <p className="font-semibold mb-3">קישורים שימושיים:</p>
        <ul className="space-y-2">
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
              <span className="text-gray-500 mr-2">— {link.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
