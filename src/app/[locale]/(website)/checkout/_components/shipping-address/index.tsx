"use client";

import React from "react";
import AddressCard from "./address-card";
import { Button } from "@/components/ui/button";
import { MoveRight, MapPin } from "lucide-react";
import { useAddresses } from "@/hooks/use-address";
import Loading from "@/app/loading";
import { useTranslations } from "next-intl";
import { DeliveryLocationDialog } from "../address-dialog";
import type { Address as AddressDto } from "@/lib/types/address";

export default function ShippingAddress({
  setStep,
  id,
  setId,
  setStreet,
  setPhone,
  setCity,
  setLat,
  setLong,
}: ShippingAddressProps) {
  //translations
  const t = useTranslations("shipping-address");

  // controls the Add / Edit / Delete addresses dialog (same one used in the header)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // handle select address
  const handleSelectAddress = (address: Address) => {
    setId(address._id);
    setStreet(address.street);
    setPhone(address.phone);
    setCity(address.city);
    setLat(address.lat || "");
    setLong(address.long || "");
  };

  // address picked/saved from the dialog uses a slightly different shape
  // (module Address type), so it's normalized before selecting it
  const handleDialogSelect = (address: AddressDto) => {
    handleSelectAddress({
      _id: address._id ?? address.id ?? "",
      street: address.street,
      phone: address.phone,
      city: address.city,
      lat: address.latitude,
      long: address.longitude,
    });
  };

  //states and queries
  const { data, isLoading, isError } = useAddresses();

  // keep this quick-select list capped at 3: they stay static while
  // nothing changes, and once a new address is added the oldest of the
  // 3 rolls off here (it's still there and editable from "Add a New
  // Address", which opens the full addresses list)
  const addresses = (data?.addresses ?? []).slice(-3);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-80">
        <Loading />;
      </div>
    );

  if (isError)
    return (
      <p className="flex justify-center items-center text-maroon-600 text-lg py-5">
        Failed to load addresses. Please try again later.
      </p>
    );

  return (
    <div className="space-y-3">
      {/* title of component */}
      <h3 className="font-semibold text-2xl sm:text-3xl">{t("title")}</h3>
      {/* addresses list show */}
      <ul className="flex flex-col gap-3 max-h-80 overflow-y-auto hide-scrollbar ">
        {addresses.length === 0 && (
          <li className="flex flex-col items-center justify-center gap-2 text-zinc-500 text-center py-8 list-none">
            <MapPin size={40} className="text-zinc-300" />
            <span>{t("no-addresses")}</span>
          </li>
        )}
        {addresses.map((address) => (
          <li key={address._id}>
            <button
              className="w-full"
              onClick={() => handleSelectAddress(address)}
            >
              {id === address._id.toString() ? (
                // if the address is selected show it with different style
                <AddressCard
                  selectedAddress={true}
                  city={address.city}
                  phone={address.phone}
                  street={address.street}
                />
              ) : (
                // if the address is not selected show it with default style
                <AddressCard
                  selectedAddress={false}
                  city={address.city}
                  phone={address.phone}
                  street={address.street}
                />
              )}
            </button>
          </li>
        ))}
      </ul>
      {/* choise to add new address */}
      <div>
        <div className="flex items-center">
          <span className="flex-1 h-0 border border-zinc-100"></span>
          <span className="text-lg font-semibold text-zinc-500 mx-2">
            {t("or")}
          </span>
          <span className="flex-1 h-0 border border-zinc-100"></span>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-maroon-50 text-maroon-600 w-full text-base font-medium hover:text-white hover:bg-maroon-600 mt-2"
        >
          {t("add-new")}
        </Button>
      </div>
      {/* next button for going to payment method */}
      <div className="flex flex-col items-end gap-1.5">
        {!id && (
          <p className="text-sm text-maroon-600">{t("select-address-first")}</p>
        )}
        <Button
          onClick={() => setStep("payment_method")}
          className="w-40 font-semibold"
          disabled={!id}
        >
          {t("next")}
          <MoveRight size={20} className="rtl:rotate-180" />
        </Button>
      </div>

      {/* Add / Edit / Delete addresses dialog (same one used in the header) */}
      <DeliveryLocationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSelectAddress={handleDialogSelect}
      />
    </div>
  );
}
