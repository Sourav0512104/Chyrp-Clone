import React, { useState } from "react";

export function ToggleAll({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<boolean[]>(items.map(() => false));

  const allChecked = checked.every(Boolean);

  function toggleAll() {
    setChecked(items.map(() => !allChecked));
  }

  function toggleOne(index: number) {
    const newChecked = [...checked];
    newChecked[index] = !newChecked[index];
    setChecked(newChecked);
  }

  return (
    <div>
      <label>
        <input type="checkbox" checked={allChecked} onChange={toggleAll} /> Toggle All
      </label>
      {items.map((item, idx) => (
        <label key={idx}>
          <input type="checkbox" checked={checked[idx]} onChange={() => toggleOne(idx)} /> {item}
        </label>
      ))}
    </div>
  );
}
