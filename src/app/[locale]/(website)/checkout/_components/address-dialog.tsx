"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Address, ViewMode } from "@/lib/types/address";
import {
  useAddresses,
  useAddressForm,
  useAddressMutations,
} from "../hooks/use-addresses";
import { ListView } from "./views/list-view";
import { FormView } from "./views/form-view";
import { DeleteView } from "./views/delete-view";

// Types
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectAddress?: (address: Address) => void;
}

// Component
export function DeliveryLocationDialog({
  open,
  onOpenChange,
  onSelectAddress,
}: Props) {
  // State
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editing, setEditing] = useState<Address | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

  // Hooks
  const { addresses, loading: addressesLoading } = useAddresses();

  // Hooks
  const { formData, mapPosition, handleFormChange, updateLocation, resetForm } =
    useAddressForm();

  const { saveLoading, deleteLoading, handleSave, handleDelete } =
    useAddressMutations(() => {
      setViewMode("list");
      setEditing(null);
      setAddressToDelete(null);
    });

  // Reset view when dialog opens
  useEffect(() => {
    if (!open) return;
    setViewMode("list");
  }, [open]);

  /* Handlers */

  const handleSelect = (address: Address) => {
    onSelectAddress?.(address);
    onOpenChange(false);
  };

  const handleAddNew = () => {
    setEditing(null);
    resetForm();
    setViewMode("form-step1");
  };

  const handleEdit = (e: React.MouseEvent, address: Address) => {
    e.stopPropagation();
    setEditing(address);
    resetForm({
      title: address.title,
      phone: address.phone,
      city: address.city,
      street: address.street,
      latitude: address.latitude,
      longitude: address.longitude,
    });
    setViewMode("form-step1");
  };

  const handleDeleteClick = (e: React.MouseEvent, address: Address) => {
    e.stopPropagation();
    setAddressToDelete(address);
    setViewMode("delete");
  };

  const confirmDelete = async () => {
    if (!addressToDelete) return;
    await handleDelete(addressToDelete._id || addressToDelete.id || "");
  };

  const onSaveAddress = async () => {
    await handleSave(formData, editing);
  };

  // Render
  return (
    // Dialog
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Content */}
      <DialogContent className="w-[92vw] sm:w-full sm:max-w-xl md:max-w-2xl lg:min-w-[53rem] lg:max-w-[53rem] max-h-[85vh] sm:max-h-[41rem] rounded-2xl overflow-y-auto p-3">
        {viewMode === "list" && (
          <ListView
            addresses={addresses}
            loading={addressesLoading}
            onAddNew={handleAddNew}
            onSelect={handleSelect}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        )}

        {(viewMode === "form-step1" || viewMode === "form-step2") && (
          // Form
          <FormView
            step={viewMode === "form-step1" ? 1 : 2}
            formData={formData}
            mapPosition={mapPosition}
            loading={saveLoading}
            editing={!!editing}
            onFormChange={handleFormChange}
            onNext={() => setViewMode("form-step2")}
            onBack={() => setViewMode("form-step1")}
            onSave={onSaveAddress}
            onLocationUpdate={updateLocation}
          />
        )}

        {viewMode === "delete" && (
          <DeleteView
            loading={deleteLoading}
            onCancel={() => setViewMode("list")}
            onConfirm={confirmDelete}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
