export default {
  async findAllAdmin(ctx) {
    const data = await strapi
      .service("api::restaurant.restaurant")
      .getAdminRestaurants(ctx.query);

    ctx.body = data;
  },
  async findOneAdmin(ctx) {
    const { id } = ctx.params;

    const data = await strapi
      .service("api::restaurant.restaurant")
      .getAdminRestaurantById(Number(id));

    ctx.body = data;
  },

  async createRestaurant(ctx) {
    const restaurant = await strapi
      .service("api::restaurant.restaurant")
      .createRestaurant(ctx.request.body);

    ctx.status = 201;
    ctx.body = {
      message: "Restaurant created successfully",
      data: {
        id: restaurant.id,
        name: restaurant.name,
        address: restaurant.address,
        city: restaurant.city,
        rating: restaurant.rating,
        isActive: restaurant.isActive,
        totalOrders: 0,
        totalRevenue: 0,
        createdAt: restaurant.createdAt,
      },
    };
  },

  async updateRestaurant(ctx) {
    const id = Number(ctx.params.id);

    const restaurant = await strapi
      .service("api::restaurant.restaurant")
      .updateRestaurant(id, ctx.request.body);

    if (!restaurant) {
      ctx.throw(404, "Restaurant not found");
    }

    ctx.body = {
      message: "Restaurant updated successfully",
      data: {
        id: restaurant.id,
        name: restaurant.name,
        address: restaurant.address,
        city: restaurant.city,
        rating: restaurant.rating,
        isActive: restaurant.isActive,
        totalOrders: restaurant.totalOrders ?? 0,
        totalRevenue: restaurant.totalRevenue ?? 0,
        createdAt: restaurant.createdAt,
      },
    };
  },

  async deleteRestaurant(ctx) {
    const id = Number(ctx.params.id);

    const result = await strapi
      .service("api::restaurant.restaurant")
      .deleteRestaurant(id);

    ctx.body = {
      message: "Restaurant deleted successfully",
      data: result,
    };
  },

  async toggleStatus(ctx) {
    const { id } = ctx.params;
    const { isActive } = ctx.request.body;

    if (typeof isActive !== "boolean") {
      return ctx.badRequest("isActive must be boolean");
    }

    const data = await strapi
      .service("api::restaurant.restaurant")
      .toggleRestaurantStatus(id, isActive);

    ctx.send(data);
  },
};
