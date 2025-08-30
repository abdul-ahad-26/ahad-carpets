"use client";

import { useEffect, useState } from "react";

export default function LocalDate({ isoDate }: { isoDate: string }) {
  const [localDate, setLocalDate] = useState("");

  useEffect(() => {
    if (isoDate) {
      const date = new Date(isoDate);
      // yaha aap specific timeZone bhi de sakte ho, e.g. "Asia/Karachi"
      setLocalDate(date.toLocaleString(undefined, { timeZone: "Asia/Karachi" }));
    }
  }, [isoDate]);

  return <span>{localDate || "N/A"}</span>;
}
