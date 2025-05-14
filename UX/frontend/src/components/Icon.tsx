function Icon({
  src,
  width,
  height,
  alt
}: {
  src: string;
  height?: string;
  width?: string;
  alt?: string
}) {
  return (
    <img
      src={src}
      style={{ width: width ?? '24px', height: height ?? 'fit-content' }}
      alt={alt ?? ''}
    />
  );
}

export default Icon;
