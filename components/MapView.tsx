'use client';

import { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, Line, ZoomableGroup } from 'react-simple-maps';
import { CITIES, CITY_MAP } from '@/data/cities';
import type { LocationType } from '@/types';

const TYPE_COLOR: Record<LocationType, { default: string; selected: string; pulse: string }> = {
  city:       { default: '#868e96', selected: '#e03131', pulse: '#e03131' },
  airport:    { default: '#74c0fc', selected: '#1971c2', pulse: '#1971c2' },
  attraction: { default: '#ffa94d', selected: '#e67700', pulse: '#e67700' },
  nearby:     { default: '#69db7c', selected: '#2f9e44', pulse: '#2f9e44' },
};

const TYPE_RADIUS: Record<LocationType, { default: number; selected: number }> = {
  city:       { default: 7, selected: 9 },
  airport:    { default: 5, selected: 7 },
  attraction: { default: 6, selected: 8 },
  nearby:     { default: 5, selected: 7 },
};

const GEO_URL = '/world-50m.json';
const TURKEY_ID = '792';

const MIN_ZOOM = 1;
const MAX_ZOOM = 8;
const CENTER: [number, number] = [35.5, 39.0];

type Props = {
  selectedCities: string[];
  onToggleCity: (id: string) => void;
};

export default function MapView({ selectedCities, onToggleCity }: Props) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: CENTER,
    zoom: 1,
  });

  const selectedSet = new Set(selectedCities);

  const routeCoords = selectedCities
    .map((id) => CITY_MAP[id])
    .filter(Boolean)
    .map((c) => [c.lng, c.lat] as [number, number]);

  function handleZoomIn() {
    setPosition((p) => {
      const next = Math.min(MAX_ZOOM, p.zoom * 1.5);
      return { ...p, zoom: next };
    });
  }

  function handleZoomOut() {
    setPosition((p) => {
      const next = Math.max(MIN_ZOOM, p.zoom / 1.5);
      return { ...p, zoom: next };
    });
  }

  function handleReset() {
    setPosition({ coordinates: CENTER, zoom: 1 });
  }

  // Scale marker elements inversely with zoom so they stay a consistent visual size
  const markerScale = 1 / position.zoom;

  return (
    <div className="relative w-full h-full bg-[#dce8f0] overflow-hidden">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: CENTER, scale: 1800 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={({ zoom, coordinates }) => setPosition({ zoom, coordinates })}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isTurkey = geo.id === TURKEY_ID;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: isTurkey ? '#f5e6c8' : '#cfdde8',
                        stroke: isTurkey ? '#c9a96e' : '#b8cdd8',
                        strokeWidth: isTurkey ? 1.2 : 0.5,
                        outline: 'none',
                      },
                      hover: { fill: isTurkey ? '#eedcb0' : '#cfdde8', outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Route lines */}
          {routeCoords.length > 1 &&
            routeCoords.slice(0, -1).map((from, i) => (
              <Line
                key={i}
                from={from}
                to={routeCoords[i + 1]}
                stroke="#e03131"
                strokeWidth={2 * markerScale}
                strokeDasharray={`${6 * markerScale} ${4 * markerScale}`}
                strokeLinecap="round"
              />
            ))}

          {/* Location markers — cities rendered last so they appear on top */}
          {[...CITIES].sort((a, b) => {
            const order: Record<LocationType, number> = { airport: 0, nearby: 1, attraction: 2, city: 3 };
            return order[a.type] - order[b.type];
          }).map((city) => {
            const isSelected = selectedSet.has(city.id);
            const selectionOrder = selectedCities.indexOf(city.id);
            const colors = TYPE_COLOR[city.type];
            const radii = TYPE_RADIUS[city.type];
            const dotR = (isSelected ? radii.selected : radii.default) * markerScale;
            const labelY = (isSelected ? -(radii.selected + 7) : -(radii.default + 6)) * markerScale;
            const fontSize = (city.type === 'city' ? (isSelected ? 11 : 10) : (isSelected ? 10 : 9)) * markerScale;

            return (
              <Marker
                key={city.id}
                coordinates={[city.lng, city.lat]}
                onClick={() => onToggleCity(city.id)}
              >
                {isSelected && (
                  <circle
                    r={14 * markerScale}
                    fill="none"
                    stroke={colors.pulse}
                    strokeWidth={1.5 * markerScale}
                    opacity={0.4}
                  >
                    <animate
                      attributeName="r"
                      from={`${10 * markerScale}`}
                      to={`${18 * markerScale}`}
                      dur="1.6s"
                      repeatCount="indefinite"
                    />
                    <animate attributeName="opacity" from="0.5" to="0" dur="1.6s" repeatCount="indefinite" />
                  </circle>
                )}

                <circle
                  r={dotR}
                  fill={isSelected ? colors.selected : colors.default}
                  stroke="white"
                  strokeWidth={2 * markerScale}
                  style={{ cursor: 'pointer' }}
                />

                {isSelected && selectionOrder >= 0 && (
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{
                      fill: 'white',
                      fontSize: 8 * markerScale,
                      fontWeight: 700,
                      pointerEvents: 'none',
                    }}
                  >
                    {selectionOrder + 1}
                  </text>
                )}

                <text
                  textAnchor="middle"
                  y={labelY}
                  style={{
                    fill: isSelected ? colors.selected : '#495057',
                    fontSize,
                    fontWeight: isSelected ? 700 : 500,
                    pointerEvents: 'none',
                    textShadow: '0 1px 3px rgba(255,255,255,0.9)',
                  }}
                >
                  {city.emoji} {city.name}
                </text>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Zoom controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1">
        <button
          onClick={handleZoomIn}
          disabled={position.zoom >= MAX_ZOOM}
          className="w-8 h-8 bg-white/95 shadow rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-lg font-bold leading-none border border-gray-200"
          title="확대"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          disabled={position.zoom <= MIN_ZOOM}
          className="w-8 h-8 bg-white/95 shadow rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-lg font-bold leading-none border border-gray-200"
          title="축소"
        >
          −
        </button>
        <button
          onClick={handleReset}
          className="w-8 h-8 bg-white/95 shadow rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 text-xs border border-gray-200"
          title="초기화"
        >
          ⊙
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-white/90 rounded-lg px-3 py-2 text-xs shadow-sm flex flex-col gap-1">
        {[
          { color: '#e03131', label: '주요 도시' },
          { color: '#1971c2', label: '공항' },
          { color: '#e67700', label: '관광지' },
          { color: '#2f9e44', label: '근교 도시' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: color }} />
            <span className="text-gray-600">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1 mt-0.5 text-gray-400">
          <span>드래그로 이동</span>
        </div>
      </div>
    </div>
  );
}
