import React, { useState } from "react";
import { useUploads } from "@/hooks/useUploads";
import UploadsModal from "./UploadsModal";

type FileInputProps = {
  name: string;
  multiple?: boolean;
};

export default function FileInput({ name, multiple = false }: FileInputProps) {
  const { send, error } = useUploads();
  const [files, setFiles] = useState<string[]>([]);
  const [modal, setModal] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const file = e.target.files[0];

    send(
      file,
      (res) => {
        if (res.data) {
          setFiles((prev) =>
            multiple ? [...prev, res.data!.name] : [res.data!.name]
          );
        }
      },
      () => alert("Upload failed"),
      () => (e.target.value = "")
    );
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        onChange={handleChange}
        multiple={multiple}
        className="border rounded p-1"
      />
      {error && <p className="text-red-600">{error}</p>}
      <ul>
        {files.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      <button
        type="button"
        className="px-3 py-1 bg-blue-500 text-white rounded"
        onClick={() => setModal(true)}
      >
        Browse Uploads
      </button>

      {modal && (
        <UploadsModal
        open={modal}
          onSelect={(file) =>
            setFiles((prev) => (multiple ? [...prev, file.name] : [file.name]))
          }
          onClose={() => setModal(false)}
        />
      )}
    </div>
  );
}
