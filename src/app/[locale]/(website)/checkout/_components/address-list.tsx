"use client";

import { Button } from "@/components/ui/button";
import { MapPin, Phone, PencilLine, Trash2 } from "lucide-react";
import { Address } from "@/lib/types/address";

// Types
interface AddressListProps {
  addresses: Address[];
  loading: boolean;
  onAddNew: () => void;
  onSelect: (address: Address) => void;
  onEdit: (e: React.MouseEvent, address: Address) => void;
  onDelete: (e: React.MouseEvent, address: Address) => void;
  translations: {
    loading: string;
    empty: string;
    add: string;
    labels: {
      home: string;
      work: string;
      family: string;
    };
  };
}

// Component
export function AddressList({
  addresses,
  loading,
  onAddNew,
  onSelect,
  onEdit,
  onDelete,
  translations: t,
}: AddressListProps) {
  // Organize labels - prefer the address's own saved title, falling back
  // to the old positional guess for legacy addresses without one
  const organizedAddresses = addresses.map((addr, index) => ({
    label:
      addr.title ||
      (index < 3
        ? [t.labels.home, t.labels.work, t.labels.family][index]
        : null),
    address: addr,
  }));

  // loading
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-b-2 border-red-600 rounded-full mx-auto" />
        <p className="text-gray-600 mt-3">{t.loading}</p>
      </div>
    );
  }

  // Empty
  if (addresses.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin size={48} className="mx-auto text-gray-400 mb-3" />
        <p className="text-gray-600 mb-4">{t.empty}</p>
        <Button
          onClick={onAddNew}
          className="bg-maroon-600 hover:bg-maroon-700"
        >
          {t.add}
        </Button>
      </div>
    );
  }

  // Render
  return (
    <div className="space-y-5">
      {organizedAddresses.map((item) => (
        <div
          key={item.address._id ?? item.address.id}
          className="relative pt-5"
        >
          {/* Label [work - home - family] */}
          {item.label && (
            <div className="absolute top-0 start-3 bg-white px-2">
              <h3 className="text-2xl font-semibold text-maroon-600 capitalize">
                {item.label}
              </h3>
            </div>
          )}

          {/* Address Card */}
          <Button
            variant="default"
            onClick={() => onSelect(item.address)}
            className="w-full h-auto text-start justify-start rounded-xl pt-6 ps-4 sm:ps-5 pe-14 sm:pe-9 pb-5 transition-all duration-150 border border-zinc-300 hover:border-maroon-600 bg-transparent hover:bg-transparent shadow-none"
          >
            <div className="w-full flex items-center justify-between">
              <div className="w-full min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                      <MapPin size={20} className="text-white" />
                    </div>
                    <p className="text-lg sm:text-2xl font-semibold text-zinc-800 truncate">
                      {item.address.city}
                    </p>
                  </div>
                  <p className="text-sm sm:text-base font-medium text-zinc-600 flex items-center gap-1 shrink-0">
                    <Phone size={18} className="shrink-0" />
                    {item.address.phone}
                  </p>
                </div>
                <p className="mt-4 text-sm sm:text-base font-medium text-zinc-800 border rounded-full px-3 bg-zinc-100 w-fit max-w-full truncate">
                  {item.address.street}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center flex-col absolute end-2 sm:-end-4 gap-1">
                <Button
                  variant="ghost"
                  onClick={(e) => onEdit(e, item.address)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-zinc-400 bg-zinc-50 flex items-center justify-center"
                >
                  <PencilLine size={16} className="text-[#3F3F46]" />
                </Button>
                <Button
                  onClick={(e) => onDelete(e, item.address)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-red-600 flex items-center justify-center"
                >
                  <Trash2 size={16} className="text-white" />
                </Button>
              </div>
            </div>
          </Button>
        </div>
      ))}
    </div>
  );
}
