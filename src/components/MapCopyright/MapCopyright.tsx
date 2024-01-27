export const MapCopyright = () => {
  return (
    <div
      style={{
        fontSize: '12px',
        position: 'absolute',
        bottom: 0,
        right: '7px',
        background: 'rgba(255,255,255,0.1)',
      }}
    >
      <a href="https://www.maptiler.com/copyright/" target="_blank">
        &copy; MapTiler
      </a>{' '}
      <a href="https://www.openstreetmap.org/copyright" target="_blank">
        &copy; OpenStreetMap contributors
      </a>
    </div>
  );
};
