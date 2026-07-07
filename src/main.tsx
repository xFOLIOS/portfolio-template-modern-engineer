import { createRoot } from "react-dom/client";
import Template from "./template";
import data from "../public/portfolio-data.json";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <Template portfolioData={data} />
);