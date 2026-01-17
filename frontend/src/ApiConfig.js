const PUBLIC_URL = import.meta.env.VITE_API_BASE_URL_PUBLIC;
const LOCAL_URL = import.meta.env.VITE_API_BASE_URL_LOCAL;

let API_BASE_URL;
const hostname = window.location.hostname;

if (hostname === "localhost" || hostname === "127.0.0.1") {
  API_BASE_URL = LOCAL_URL;
} else if (hostname.startsWith("192.168.")) {
  API_BASE_URL = LOCAL_URL;
} else {
  API_BASE_URL = PUBLIC_URL;
}

export default API_BASE_URL;
