"use client";

import { useTranslations } from "next-intl";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AddressList } from "../address-list";
import { Address } from "@/lib/types/address";

// Types
interface ListViewProps {
  addresses: Address[];
  loading: boolean;
  onAddNew: () => void;
  onSelect: (address: Address) => void;
  onEdit: (e: React.MouseEvent, address: Address) => void;
  onDelete: (e: React.MouseEvent, address: Address) => void;
}

// Component
export function ListView({
  addresses,
  loading,
  onAddNew,
  onSelect,
  onEdit,
  onDelete,
}: ListViewProps) {
  const t = useTranslations("deliveryDialog");

  return (
    <>
      {/* Header */}
      <DialogHeader className="py-3 px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
          {/* Title */}
          <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-800">
            {t("title")}
          </DialogTitle>
          {/* Add New */}
          <Button
            onClick={onAddNew}
            variant="secondary"
            className="text-maroon-600 text-sm sm:text-base font-medium"
          >
            {t("add-new")}
          </Button>
        </div>
      </DialogHeader>

      <div className="pe-2 sm:pe-4 py-4 px-4 sm:px-6 max-h-[60vh] sm:max-h-[500px] overflow-y-auto">
        {/* Address List */}
        <AddressList
          addresses={addresses}
          loading={loading}
          onAddNew={onAddNew}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          translations={{
            loading: t("loading"),
            empty: t("empty"),
            add: t("add"),
            labels: {
              home: t("labels.home"),
              work: t("labels.work"),
              family: t("labels.family"),
            },
          }}
        />
      </div>
    </>
  );
}
