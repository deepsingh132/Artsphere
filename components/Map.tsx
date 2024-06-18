import { useState, useMemo, useEffect, useCallback } from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  Autocomplete,
} from "@react-google-maps/api";
import Spinner from "./Spinner";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

import { classNames } from "primereact/utils";
import { AutoComplete } from "primereact/autocomplete";
import  "./maps.css";
import { MapPinIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import moment from "moment";
import { backendUrl } from "@/app/utils/config/backendUrl";

export default function GoogleMapsLoader({ currentEvent, accessToken}) {

  const [libraries] = useState(["places"]) as any;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries
  });

  if (!isLoaded) return <Spinner />;

  return <Map isLoaded={isLoaded} currentEvent={currentEvent} accessToken={accessToken}/>;
}
function Map({ isLoaded, currentEvent, accessToken}) {
  const [selected, setSelected] = useState(null);
  const [center, setCenter] = useState({ lat: currentEvent?.lat, lng: currentEvent?.lng });
  const onLoad = useCallback((map: any) => { addMarkers(map, currentEvent,accessToken);}, [accessToken, currentEvent]);

  useMemo(() => {
    if (selected) {
      setCenter(selected);
    }
  }, [selected]);

  const options = {
    disableDefaultUI: true,
    zoomControl: true,
    fields: ["place_id", "geometry", "icon", "name"],
    strictBounds: true,
    types: ["(regions)"],
  };

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "0",
  };

  return (
    <div className="w-full h-[40vh] md:h-[calc(100vh-80px)]">
      <div
        className="flex items-center  justify-center absolute top-2 left-1/2 bg-white rounded-lg md:p-4 p-2 shadow-md md:mx-auto -translate-x-1/2 w-[90%] md:w-fit z-[9999]">
        <span className="text-gray-400 border border-lightBorderColor dark:border-gray-300 rounded-md p-2 ">
          <MapPinIcon className="h-6 left-0 w-6 m-0 text-gray-400" />
        </span>
        <PlacesAutocomplete setSelected={setSelected} />
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        mapContainerClassName="map-container"
        options={options}
        onLoad={onLoad}
        center={center}
      >
        {selected && <MarkerF position={selected} />}
      </GoogleMap>
    </div>
  );
}

const addMarkers = async (map: object | null | undefined,currentEvent: { lat: any; },accessToken: string) => {
  const { data } = await axios.get(
    `${backendUrl}/events`,
    // add accessToken to headers
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    }
  );
  const events = data?.events || [];
  events.forEach((event: { coordinates: { lat: any; lng: any; }; title: any; description: any; location: any; date: moment.MomentInput; image: any; link: any; }) => {
    const marker = new google.maps.Marker({
      position: {
        lat: event.coordinates?.lat,
        lng: event.coordinates?.lng,
      },
      map: map as any,
      title: event.title,
    });
    // add info window and event listener for each marker
    // create html content for info window


    // custom marker
    marker.setIcon({
      url: "https://cdn-icons-png.flaticon.com/512/10750/10750776.png",
      scaledSize: new google.maps.Size(50, 50),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(25, 50),
    });

    const contentString = `
    <div class="mainContainer flex flex-col h-full justify-center items-center">
    <div class="flex flex-col w-full justify-center items-center">
    <div class="flex w-full justify-center rounded-t-[4px] p-[5px] bg-primary mx-2">
        <h1 class="text-text font-bold md:text-xl text-xl lg:text-lg">
          ${event?.title}
        </h1>
        </div>
        <div class="flex w-full justify-between mx-2 p-4">
        <div class="eventDesc flex flex-col">
        <span class="text-black font-semibold md:text-lg">
          Event Description
        </span>
        <span class=" text-gray-700 font-normal md:text-base">
          ${event?.description}
        </span>
        <span class="text-black font-semibold md:text-lg">
          Event Location
        </span>
        <span class=" text-gray-700 font-normal md:text-base">
          ${event?.location}
        </span>
        <span class="text-black font-semibold md:text-base">
          ${moment(event?.date).format("Do-MMM-YY")}
        </span>
        </div>
         <div class="flex flex-col mt-2 justify-start">
        <img src=${event?.image} alt=${
      event?.title
    } class="md:w-[100px] md:h-[100px] w-[80px] h-[80px] object-cover rounded" />
        <a href=${event?.link} target="_blank">
        <Button label="Register" className="p-button-raised" />
        </a>
        </div>
        </div>
    `;

    const infowindow = new google.maps.InfoWindow({
      content: contentString,
    });

    // open the currentEvent's info window by default
    if (event?.coordinates?.lat === currentEvent?.lat) {
      infowindow.open(map, marker);
    }

    marker.addListener("mouseover", () => {
      infowindow.open(map, marker);
    });

    // close info window on map click
    if (map) {
      google.maps.event.addListener(map, "click", function () {
        infowindow.close();
      });
    }
  });

  // also create info windows for each marker and add event listeners

  // You can customize the marker icon, info window, or other properties as needed
  // Example:
  // marker.setIcon('your-custom-icon.png');
  // const infowindow = new google.maps.InfoWindow({ content: event.title });
  // marker.addListener('click', () => infowindow.open(map, marker));
};

const PlacesAutocomplete = ({ setSelected }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data } = {},
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address: any) => {
    clearSuggestions();
    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setSelected({ lat, lng });
  };

  useEffect(() => {

    /**
     * NOTE: Workaround for the issue with the p-autocomplete-item text color
     * TODO: Remove this workaround once the styles are separately available or created in tailwind.config.js
     */

    if(!document) return;

    // change the text color of the p-autocomplete-item to black
    const style = document.createElement("style");
    style.innerHTML = `
      .p-autocomplete-item {
        color: black;
      }
    `;
    document.head.appendChild(style);

  }, []);

  return (
    <>
      {ready && (
        <>
          <AutoComplete
            id="map-autocomplete"
            value={value}
            suggestions={
              status === "OK" && data
                ? data.map(({ structured_formatting }) => ({
                    name: structured_formatting.main_text,
                  }))
                : []
            }
            completeMethod={() => {}} // an empty function is required in this case
            field="name"
            disabled={!ready}
            inputClassName="w-full !bg-white !relative !border-none"
            panelStyle={{
              width: "auto",
              backgroundColor: "white",
              color: "!black",
              zIndex: 9999,
              boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.2)",
              borderRadius: "6px",
              marginTop: "-4px",
              padding: "1rem",
            }}
            inputStyle={{
              width: "300px",
              color: "black",
              paddingLeft: "1rem",
              position: "relative",
              borderRadius: "6px",
            }}
            style={{ width: "100%", color: "black"}}
            onSelect={(e) => handleSelect(e.value?.name)}
            className={classNames(
              "!w-full !border-gray-400 !rounded-md  !relative p-0",
              "!bg-white"
            )}
            // className="w-full !rounded-xl"
            placeholder="Enter a city"
            onChange={(e) => setValue(e.target.value, true)}
          />
        </>
      )}
    </>
  );
};
