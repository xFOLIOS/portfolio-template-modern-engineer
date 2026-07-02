import { createRoot } from "react-dom/client";
import Template from "./template";
import "./index.css";

fetch("./portfolio-data.json")
  .then((response) => response.json())
  .then((data) => {
    createRoot(document.getElementById("root")!).render(
      <Template portfolioData={data} />
    );
  })
  .catch((error) => console.error("Error loading portfolio data:", error));