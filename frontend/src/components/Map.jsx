import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, ScaleControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router";

export default function Map() {
    const position = [20.987680962193263, -89.62134223099004]

    return (
        <MapContainer center={position} zoom={13} style={{ width: '100%', height: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ScaleControl position="bottomright" />
            <Marker position={position}>
                <Popup>
                    <small className="text-center">
                        <b>Centro Internacional de Congresos de Yucatán</b><br/>
                        C. 62 294, Centro, 97000 Mérida, Yuc.

                        Palacio de exposiciones y congresos</small>
                        <Link to={'https://search.google.com/local/reviews?placeid=ChIJR4kCZ1dxVo8RRLqlpfONTXU&q=Centro+Internacional+de+Congresos+de+Yucat%C3%A1n&hl=es&gl=MX'}>
                            2,260 reviews
                        </Link>
                </Popup>
            </Marker>
        </MapContainer>
    )
}
