import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currency = "$";

  // Access the environment variable for the backend URL
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Correct way to access the VITE_ environment variable in Vite

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);

    let age = today.getFullYear() - birthDate.getFullYear();
    return age;
  };

  const months = [
    " ",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    if (typeof slotDate !== "string" || !slotDate) {
      // return (new String(slotDate)).valueOf()
      return "Date not available"; // Fallback text for invalid dates
    }

    const dateArray = slotDate.split("_");
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  };

  const formatSlotTime = (time) => {
    if (!time) return "Not Provided";

    const date = new Date(`1970-01-01T${time}`); // using a placeholder date to parse the time
    let hours = date.getHours();
    let minutes = date.getMinutes();

    // Format to HH:mm
    return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}`;
  };

  const value = {
    calculateAge,
    slotDateFormat,
    currency,
    formatSlotTime,
    backendUrl, // Add backendUrl to context value
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
