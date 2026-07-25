"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import OccasionsHeader from "./occasions-header";
import OccasionsList from "./occasions-list";

export default function OccasionsWrapper() {
  // local input state used for debouncing
  const [input, setInput] = useState("");

  // debounce input for 500ms
  const [search] = useDebounce(input, 500);

  return (
    <>
      <OccasionsHeader search={input} onSearchChange={setInput} />
      <OccasionsList search={search} />
    </>
  );
}
