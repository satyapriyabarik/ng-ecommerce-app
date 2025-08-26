import { createContext, useContext, useRef } from "react";

// The ref can initially be null, so we allow RefObject<HTMLAnchorElement | null>
const CartIconContext = createContext<React.RefObject<HTMLAnchorElement | null> | null>(null);

export const CartIconProvider = ({ children }: { children: React.ReactNode }) => {
    const cartRef = useRef<HTMLAnchorElement>(null); // type is RefObject<HTMLAnchorElement | null>
    return (
        <CartIconContext.Provider value={cartRef}>
            {children}
        </CartIconContext.Provider>
    );
};

export const useCartIcon = () => {
    const context = useContext(CartIconContext);
    if (!context) {
        throw new Error("useCartIcon must be used within CartIconProvider");
    }
    return context;
};
