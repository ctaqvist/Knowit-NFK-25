function Icon({
  src,
  width,
  height,
}: {
  src: string;
  height?: string;
  width?: string;
}) {
  return (
    <img
      src={src}
      style={{ width: width ?? '24px', height: height ?? 'fit-content' }}
    />
  );
}

export default Icon;
