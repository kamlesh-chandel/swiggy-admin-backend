export default {
  async findAllByRestaurantAdmin(ctx) {
    const { restaurantId } = ctx.params;

    const data = await strapi
      .service("api::food-item.food-item")
      .getAdminFoodItemsByRestaurant(Number(restaurantId));

    ctx.body = data;
  },

  async findOneAdmin(ctx) {
    const { id } = ctx.params;

    const data = await strapi
      .service("api::food-item.food-item")
      .getAdminFoodItemById(Number(id));

    ctx.body = data;
  },

  async createFoodItem(ctx) {
    const data = await strapi
      .service("api::food-item.food-item")
      .createFoodItem(ctx.request.body);

    ctx.body = data;
  },

  async updateFoodItem(ctx) {
    const { id } = ctx.params;

    const data = await strapi
      .service("api::food-item.food-item")
      .updateFoodItem(Number(id), ctx.request.body);

    ctx.body = data;
  },

  async deleteFoodItem(ctx) {
    const { id } = ctx.params;

    const data = await strapi
      .service("api::food-item.food-item")
      .deleteFoodItem(Number(id));

    ctx.body = data;
  },
};
