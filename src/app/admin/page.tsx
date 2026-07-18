import MembersAdmin from "@/components/admin/MembersAdmin";
import GroupImagesAdmin from "@/components/admin/GroupImagesAdmin";
import ReportsAdmin from "@/components/admin/ReportsAdmin";
import SoknaderAdmin from "@/components/admin/SoknaderAdmin";

export default function AdminPage() {
  return (
    <main>
      <h1 className="text-3xl font-bold text-foreground-primary mb-2">
        Adminpanel
      </h1>
      <p className="text-foreground-secondary mb-10">
        Endringer lagres med en gang og vises direkte på siden.
      </p>
      <div className="space-y-12">
        <MembersAdmin />
        <GroupImagesAdmin />
        <ReportsAdmin />
        <SoknaderAdmin />
      </div>
    </main>
  );
}
