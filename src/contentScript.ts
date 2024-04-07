const script = document.createElement("script");
script.src = chrome.runtime.getURL("fix.js");
script.onload = () => {
  script.remove();
};

(document.head || document.documentElement).appendChild(script);

window.addEventListener("variationsFixed", (e: Event) => {
  const headerElement = document.querySelector("#a-popover-3 .a-popover-header");

  if (headerElement) {
    const animationImg = document.createElement("img");
    animationImg.src = chrome.runtime.getURL("spinner.png");
    animationImg.classList.add("spinner-image", "spinner");
    headerElement.appendChild(animationImg);
    let isClosedHandled = false;
    const observer = new MutationObserver((mutationsList, observer) => {
      if (isClosedHandled) return;

      for (const mutation of mutationsList) {
        if (mutation.type === "attributes" && mutation.attributeName === "style") {
          const target = mutation.target as HTMLElement;
          if ((target.style.display === "none" || target.style.visibility === "hidden") && animationImg.parentElement) {
            animationImg.remove();
            observer.disconnect();
            isClosedHandled = true;
            break;
          }
        }
      }
    });

    const modalElement = document.getElementById("a-popover-3");
    if (modalElement) {
      observer.observe(modalElement, {
        attributes: true,
        attributeFilter: ["style"],
      });
    }
  }
});