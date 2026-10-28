import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";

export default function Profile() {
  return (
    <>
      <PageHeader>
        <Button>
          <Plus className="h-4 w-4" /> Nueva zona
        </Button>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-3"></div>
    </>
  );
}
