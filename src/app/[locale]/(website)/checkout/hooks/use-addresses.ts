import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Address, AddressFormData } from "@/lib/types/address";
import {
  getAddressesAction,
  deleteAddressAction,
  addAddressAction,
  updateAddressAction,
} from "@/lib/actions/address.actions";

// Query Keys
// NOTE: this key must stay different from the ["addresses"] key used by
// the global `useAddresses` hook (src/hooks/use-address.ts). Both hooks
// return different shapes (raw array here vs. { message, addresses }
// there); sharing the same key made react-query collapse them into one
// cache entry, so whichever hook fetched first "won" and the other
// rendered stale/empty data (e.g. a newly added address not showing up).
export const addressKeys = {
  all: ["checkout-addresses"] as const,
};

const defaultCoords = { lat: 30.0444, lng: 31.2357 };

// ============ useAddresses
export function useAddresses() {
  const { status } = useSession();
  const {
    data: addresses = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: addressKeys.all,
    queryFn: async () => {
      const data = await getAddressesAction();
      return Array.isArray(data) ? data : [];
    },
    enabled: status === "authenticated",
  });

  return {
    addresses,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}

//  useAddressForm
export function useAddressForm() {
  // State
  const [formData, setFormData] = useState<AddressFormData>({
    title: "",
    phone: "",
    city: "",
    street: "",
    latitude: defaultCoords.lat.toString(),
    longitude: defaultCoords.lng.toString(),
  });

  const [mapPosition, setMapPosition] = useState(defaultCoords);

  // handlers
  const handleFormChange = (field: keyof AddressFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateLocation = (lat: number, lng: number) => {
    setMapPosition({ lat, lng });
    setFormData((prev) => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
    }));
  };

  const resetForm = (custom?: Partial<AddressFormData>) => {
    setFormData({
      title: "",
      phone: "",
      city: "",
      street: "",
      latitude: defaultCoords.lat.toString(),
      longitude: defaultCoords.lng.toString(),
      ...custom,
    });

    setMapPosition({
      lat: parseFloat(custom?.latitude ?? defaultCoords.lat.toString()),
      lng: parseFloat(custom?.longitude ?? defaultCoords.lng.toString()),
    });
  };

  return {
    formData,
    mapPosition,
    handleFormChange,
    updateLocation,
    resetForm,
    setMapPosition,
  };
}

//  useAddressMutations 
export function useAddressMutations(onSuccess: () => void) {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: addressKeys.all }),
      // The "Shipping Address" quick-list on the checkout page (and any
      // other consumer of the global useAddresses hook) reads from the
      // ["addresses"] key, not ["checkout-addresses"] - without also
      // invalidating it here, a newly added/edited/deleted address only
      // shows up there after a full page reload.
      queryClient.invalidateQueries({ queryKey: ["addresses"] }),
    ]);
    onSuccess();
  };

  const saveMutation = useMutation({
    mutationFn: async ({
      formData,
      editing,
    }: {
      formData: AddressFormData;
      editing: Address | null;
    }) => {
      const id = editing?._id ?? editing?.id;
      if (editing && id) {
        await updateAddressAction(id, formData);
      } else {
        await addAddressAction(formData);
      }
    },
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: async (addressId: string) => {
      await deleteAddressAction(addressId);
    },
    onSuccess: invalidate,
  });

  return {
    saveLoading: saveMutation.isPending,
    deleteLoading: deleteMutation.isPending,
    saveError:
      saveMutation.error instanceof Error ? saveMutation.error.message : null,
    deleteError:
      deleteMutation.error instanceof Error
        ? deleteMutation.error.message
        : null,
    handleSave: (formData: AddressFormData, editing: Address | null) =>
      saveMutation.mutate({ formData, editing }),
    handleDelete: (addressId: string) => deleteMutation.mutate(addressId),
  };
}
