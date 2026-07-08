export async function getAddresses() {
  const res = await fetch("/api/addresses", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch addresses");

  return res.json();
}
