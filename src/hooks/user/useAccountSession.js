import { useEffect, useRef } from "react";
import useAuthStore from "../../stores/authStore";
import useCartStore from "../../stores/cartStore";
import useCheckoutStore from "../../stores/checkoutStore";

/**
 * Keeps the cart and checkout in step with who is signed in.
 *
 * Signing in: anything added as a guest is uploaded to the account's cart, and
 * the account's own cart is loaded. Before this, a guest's item vanished the
 * moment they signed in, because the cart page replaced it with the (empty)
 * server cart.
 *
 * Signing out: the signed-in person's cart and delivery details are cleared from
 * this browser, so the next visitor does not see them. Custom cakes designed in
 * the 3D builder only ever lived in this browser, so they stay.
 */
export default function useAccountSession() {
  const userId = useAuthStore((state) => state.user?._id || null);
  const lastUserId = useRef(undefined);

  useEffect(() => {
    if (lastUserId.current === userId) return;
    const previous = lastUserId.current;
    lastUserId.current = userId;

    if (userId) {
      useCartStore.getState().syncWithServer();
    } else if (previous) {
      useCartStore.setState((state) => ({
        items: state.items.filter(
          (item) => typeof item._id === "string" && item._id.startsWith("local_")
        ),
        promoCode: null,
        isSynced: false,
      }));
      useCheckoutStore.getState().resetCheckout();
    }
  }, [userId]);
}
