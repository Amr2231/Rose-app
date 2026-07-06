// Address
// NOTE: matches the backend's Address model - title is a required label
// (e.g. "Home", "Work"), and coordinates are latitude/longitude (not the
// old lat/long shorthand). There's no username field on this resource.
export interface Address {
  _id?: string;
  id?: string;
  title: string;
  isPrimary?: boolean;
  street: string;
  city: string;
  phone: string;
  latitude: string;
  longitude: string;
}

// Address form
export interface AddressFormData {
  title: string;
  city: string;
  street: string;
  phone: string;
  latitude: string;
  longitude: string;
}

export type ModalMode = "add" | "edit";

export type ViewMode = "list" | "form-step1" | "form-step2" | "delete";