import axios from "axios";

const httpInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://vendorproof.oluwadunsin.dev/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default httpInstance;
