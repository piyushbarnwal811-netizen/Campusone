import { CAMPUS_LOCATIONS, CAMPUS_MAP_EMBED_URL } from "../config/campusMap";

const CampusMap = () => {
  return (
    <div className="page campus-map-page">
      <h2>Rungta International Skill University - Campus Map</h2>
      <p className="muted">Find blocks, library, mess, canteen and other important places.</p>

      <div className="campus-map-grid">
        <section className="campus-map-panel">
          {CAMPUS_MAP_EMBED_URL ? (
            <iframe
              src={CAMPUS_MAP_EMBED_URL}
              title="RISU Campus Map"
              className="campus-map-frame"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="campus-map-empty">
              <h3>Map URL Missing</h3>
              <p>Add `VITE_CAMPUS_MAP_EMBED_URL` in `client/.env` and restart client.</p>
            </div>
          )}
        </section>

        <aside className="campus-location-list">
          {CAMPUS_LOCATIONS.map((location) => (
            <div className="campus-location-card" key={location.id}>
              <h3>{location.title}</h3>
              <p><strong>Zone:</strong> {location.zone}</p>
              <p>{location.details}</p>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default CampusMap;
