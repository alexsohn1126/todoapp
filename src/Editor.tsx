function Editor({
  value,
  onChange,
}: {
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <textarea onChange={(e) => onChange(e.target.value)}>{value}</textarea>
  );
}

export default Editor;
