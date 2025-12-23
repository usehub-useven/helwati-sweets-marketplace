import { supabase } from "@/integrations/supabase/client";

interface CreateLikeNotificationParams {
  productOwnerId: string;
  actorId: string;
  productTitle: string;
  productId: string;
}

export const createLikeNotification = async ({
  productOwnerId,
  actorId,
  productTitle,
  productId,
}: CreateLikeNotificationParams) => {
  // Don't notify if user likes their own product
  if (productOwnerId === actorId) return;

  const { error } = await supabase.from("notifications").insert({
    user_id: productOwnerId,
    actor_id: actorId,
    type: "like",
    title: "إعجاب جديد ❤️",
    message: `قام شخص بالإعجاب بمنتجك: ${productTitle}`,
    link: `/product/${productId}`,
  });

  if (error) {
    console.error("Failed to create notification:", error);
  }
};
