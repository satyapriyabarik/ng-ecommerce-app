// utils/flyToCart.ts
export function flyToCart(imgEl: HTMLImageElement, cartEl: HTMLElement) {
    const imgRect = imgEl.getBoundingClientRect();
    const cartRect = cartEl.getBoundingClientRect();

    const clone = imgEl.cloneNode(true) as HTMLImageElement;
    clone.style.position = "fixed";
    clone.style.left = imgRect.left + "px";
    clone.style.top = imgRect.top + "px";
    clone.style.width = imgRect.width + "px";
    clone.style.height = imgRect.height + "px";
    clone.style.zIndex = "2000";
    clone.style.transition = "all 1s ease-in-out";

    document.body.appendChild(clone);

    requestAnimationFrame(() => {
        clone.style.left = cartRect.left + "px";
        clone.style.top = cartRect.top + "px";
        clone.style.width = "20px";
        clone.style.height = "20px";
        clone.style.opacity = "0.5";
    });

    clone.addEventListener("transitionend", () => {
        clone.remove();
    });
}
