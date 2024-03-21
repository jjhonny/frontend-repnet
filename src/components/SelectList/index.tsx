import { SelectHTMLAttributes } from "react";

interface SelectList extends SelectHTMLAttributes<HTMLSelectElement> {}

export function SelectList() {
  return (
    <select className="select select-bordered w-full mt-2 mb-2">
      <option value="R">Representante</option>
      <option value="C">Cliente</option>
    </select>
  );
}
