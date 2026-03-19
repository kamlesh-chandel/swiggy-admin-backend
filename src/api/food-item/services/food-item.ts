export default {
  /* =========================================================
     LIST FOOD ITEMS BY RESTAURANT (ADMIN TABLE)
  ========================================================= */

async getAdminFoodItemsByRestaurant(restaurantId: number) {
  try {
    // const restaurant = await strapi.db
    //   .query("api::restaurant.restaurant")
    //   .findOne({
    //     where: {
    //       id: restaurantId,
    //       publishedAt: { $notNull: true },
    //     },
    //   });

    // if (!restaurant) {
    //   return {
    //     success: false,
    //     errorCode: "RESOURCE_NOT_FOUND",
    //     message: "Restaurant not found",
    //   };
    // }

    const foodItems = await strapi.db
      .query("api::food-item.food-item")
      .findMany({
        where: {
          publishedAt: { $notNull: true },
          restaurant: restaurantId,
        },
        populate: {
          restaurant: {
            select: ["id", "name"],
          },
          image: true,
        },
        orderBy: { createdAt: "desc" },
      });

    const data = foodItems.map((item: any) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      createdAt: item.createdAt,

      restaurant: {
        id: item.restaurant?.id,
        name: item.restaurant?.name,
      },

      image: item.image
        ? {
            id: item.image.id,
            url: item.image.url,
          }
        : null,
    }));

    return { data, total: data.length };

  } catch (err) {
    strapi.log.error("food item list error", err);
    throw err;
  }
},

  /* =========================================================
     VIEW SINGLE FOOD ITEM
  ========================================================= */

  async getAdminFoodItemById(id: number) {
    try {
      const item = await strapi.db.query("api::food-item.food-item").findOne({
        where: {
          id,
          publishedAt: { $notNull: true },
        },
        populate: {
          restaurant: {
            select: ["id", "name"],
          },
          image: true,
        },
      });

      if (!item) {
        throw new Error("Food item not found");
      }

      return {
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        createdAt: item.createdAt,
        restaurant: item.restaurant,
        image: item.image,
      };
    } catch (err) {
      strapi.log.error("food item view error", err);
      throw err;
    }
  },

  /* =========================================================
     CREATE
  ========================================================= */
async createFoodItem(body: any) {
  const created = await strapi.db
    .query("api::food-item.food-item")
    .create({
      data: {
        name: body.name,
        price: body.price,
        description: body.description,
        restaurant: body.restaurant,
        image: body.image,
        publishedAt: new Date(),
      },
    });

  return created;
},

  /* =========================================================
     UPDATE
  ========================================================= */

async updateFoodItem(id: number, body: any) {
  const updated = await strapi.db
    .query("api::food-item.food-item")
    .update({
      where: { id },
      data: {
        name: body.name,
        price: body.price,
        description: body.description,
        restaurant: body.restaurant,
        image: body.image,
      },
    });

  return updated;
},

  /* =========================================================
     DELETE
  ========================================================= */

  async deleteFoodItem(id: number) {
    await strapi.entityService.delete("api::food-item.food-item", id);

    return { success: true };
  },
};
