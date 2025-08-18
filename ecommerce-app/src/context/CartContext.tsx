// CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useQuery, useMutation } from "@apollo/client";
import {
    ADD_TO_CART,
    UPDATE_CART_QUANTITY,
    REMOVE_FROM_CART,
    CLEAR_CART,
    GET_CART,
} from "../graphql/mutations";

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { token } = useAuth();
    const [cart, setCart] = useState<any[]>([]);

    // Fetch cart from server when logged in
    const { data, refetch } = useQuery(GET_CART, {
        skip: !token,
        fetchPolicy: "network-only",
    });

    useEffect(() => {
        if (data?.getCart) {
            setCart(data.getCart);
        }
    }, [data]);

    // Mutations
    const [addToCartMutation] = useMutation(ADD_TO_CART);
    const [updateCartMutation] = useMutation(UPDATE_CART_QUANTITY);
    const [removeFromCartMutation] = useMutation(REMOVE_FROM_CART);
    const [clearCartMutation] = useMutation(CLEAR_CART);

    /** ✅ ADD TO CART with full product */
    const addToCart = async (product: any, quantity: number) => {
        setCart((prev) => {
            const cartArray = Array.isArray(prev) ? prev : [];
            const existing = cartArray.find(
                (item) => item.product._id === product._id
            );
            if (existing) {
                return cartArray.map((item) =>
                    item.product._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            // ✅ store full product object (with title, price, image...)
            return [...cartArray, { product, quantity }];
        });

        try {
            await addToCartMutation({
                variables: { productId: product._id, quantity },
            });
        } catch (err) {
            console.error("Add to cart failed", err);
            await refetch();
        }
    };

    /** ✅ Update Quantity with Optimistic UI */
    const updateCart = async (productId: string, quantity: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.product._id === productId ? { ...item, quantity } : item
            )
        );

        try {
            await updateCartMutation({ variables: { productId, quantity } });
            await refetch();
        } catch (err) {
            console.error("Update cart failed:", err);
            await refetch();
        }
    };

    /** ✅ Remove Item */
    const removeFromCart = async (productId: string) => {
        setCart((prev) => prev.filter((item) => item.product._id !== productId));

        try {
            await removeFromCartMutation({ variables: { productId } });
            await refetch();
        } catch (err) {
            console.error("Remove from cart failed:", err);
            await refetch();
        }
    };

    /** ✅ Clear Cart */
    const clearCart = async () => {
        setCart([]); // instant clear

        try {
            await clearCartMutation();
            await refetch();
        } catch (err) {
            console.error("Clear cart failed:", err);
            await refetch();
        }
    };

    return (
        <CartContext.Provider
            value={{ cart, addToCart, updateCart, removeFromCart, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
