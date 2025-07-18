import { toast } from "react-toastify";
export function Notify(msg = "an error occured") {
  toast(msg, { position: "top-center" });
}
