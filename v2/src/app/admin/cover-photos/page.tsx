import type { Metadata } from "next";
import { getAllCountriesWithCovers } from "@/server/repositories/cover-photos";
import { CoverPhotosAdmin } from "@/components/admin/cover-photos/CoverPhotosAdmin";

export const metadata: Metadata = {
  title: "Manage Cover Photos",
};

export default async function AdminCoverPhotosPage() {
  const countries = await getAllCountriesWithCovers();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Cover Photos</h1>
      <p className="mb-6 text-gray-500">
        Set a custom cover photo for each country or state page. If no custom
        photo is set, the latest blog&apos;s cover photo is used.
      </p>
      <CoverPhotosAdmin countries={countries} />
    </div>
  );
}
