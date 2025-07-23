import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <>
      <h1> 404 NOT FOUND </h1>
      <h2>The page you are looking for does not exist!</h2>
      <span>
        Click <Link to="/">here</Link> to return to Sound Map 🎵
      </span>
    </>
  );
}
