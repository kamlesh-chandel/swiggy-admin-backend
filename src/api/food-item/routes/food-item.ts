export default {
  routes: [
    {
      method: "GET",
      path: "/admin/restaurants/:restaurantId/food-items",
      handler: "food-item.findAllByRestaurantAdmin",
      config: { auth: {} },
    },
    {
      method: "GET",
      path: "/admin/food-items/:id",
      handler: "food-item.findOneAdmin",
      config: { auth: {} },
    },
    {
      method: "POST",
      path: "/admin/food-items",
      handler: "food-item.createFoodItem",
      config: { auth: {} },
    },
    {
      method: "PUT",
      path: "/admin/food-items/:id",
      handler: "food-item.updateFoodItem",
      config: { auth: {} },
    },
    {
      method: "DELETE",
      path: "/admin/food-items/:id",
      handler: "food-item.deleteFoodItem",
      config: { auth: {} },
    },
  ],
};
