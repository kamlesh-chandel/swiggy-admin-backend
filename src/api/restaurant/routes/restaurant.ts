export default {
  routes: [
    {
      method: "GET",
      path: "/admin/restaurants",
      handler: "restaurant.findAllAdmin",
      config: { auth: {} },
    },
    {
      method: "GET",
      path: "/admin/restaurants/:id",
      handler: "restaurant.findOneAdmin",
      config: { auth: {} },
    },
    {
      method: "POST",
      path: "/admin/restaurants",
      handler: "restaurant.createRestaurant",
      config: { auth: {} },
    },
    {
      method: "PUT",
      path: "/admin/restaurants/:id",
      handler: "restaurant.updateRestaurant",
      config: { auth: {} },
    },
    {
      method: "DELETE",
      path: "/admin/restaurants/:id",
      handler: "restaurant.deleteRestaurant",
      config: { auth: {} },
    },
    {
      method: "PATCH",
      path: "/admin/restaurants/:id/status",
      handler: "restaurant.toggleStatus",
      config: { auth: {} },
    },
  ],
};
