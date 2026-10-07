import Input from "../ui/Input.jsx";

export default function ImageUrlInput({ label, value, onChange }) {
  return (
    <div>
      <Input label={label} type="url" placeholder="https://..." value={value || ""} onChange={onChange} />
      {value && (
        <img
          src={value}
          alt="preview"
          className="mt-2 h-24 w-24 rounded-xl object-cover ring-1 ring-nude/40"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      )}
    </div>
  );
}
