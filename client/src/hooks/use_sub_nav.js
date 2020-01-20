import { useEffect } from "react";

function useSubNav() {
  useEffect(() => {
    document.querySelector(".navbar").style.boxShadow = "none";
    document.querySelector("#home").style.marginTop = "150px";
  });
}

export default useSubNav;
