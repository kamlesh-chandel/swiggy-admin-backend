export default {
  /* =========================================================
     ADMIN RESTAURANTS LIST (TABLE API)
  ========================================================= */

  async getAdminRestaurants() {
    try {
      const restaurants = await strapi.db
        .query("api::restaurant.restaurant")
        .findMany({
          where: {
            publishedAt: { $notNull: true },
          },
          orderBy: { createdAt: "desc" },
        });

      const orders = await strapi.entityService.findMany("api::order.order", {
        fields: ["totalAmount"],
        populate: {
          restaurant: {
            fields: ["id"],
          },
        },
        pagination: { pageSize: 100000 },
      });
      const map: Record<string, { totalOrders: number; totalRevenue: number }> =
        {};

      for (const order of orders as any[]) {
        const restaurantDocId = order.restaurant?.documentId;
        if (!restaurantDocId) continue;

        if (!map[restaurantDocId]) {
          map[restaurantDocId] = { totalOrders: 0, totalRevenue: 0 };
        }

        map[restaurantDocId].totalOrders += 1;
        map[restaurantDocId].totalRevenue += Number(order.totalAmount || 0);
      }
      const data = restaurants.map((r: any) => ({
        id: r.id,
        name: r.name,
        address: r.address,
        city: r.city,
        rating: r.rating,
        isActive: r.isActive,
        totalOrders: map[r.documentId]?.totalOrders || 0,
        totalRevenue: map[r.documentId]?.totalRevenue || 0,
        createdAt: r.createdAt,
      }));
      return { data, total: data.length };
    } catch (err) {
      strapi.log.error("restaurant list error", err);
      throw err;
    }
  },
  /* =========================================================
   VIEW SINGLE RESTAURANT (DRAWER)
========================================================= */

  async getAdminRestaurantById(id: number) {
    try {
      // 1. Fetch restaurant (published only)
      const restaurant = await strapi.db
        .query("api::restaurant.restaurant")
        .findOne({
          where: {
            id,
            publishedAt: { $notNull: true },
          },
          populate: {
            food_items: {
              where: {
                publishedAt: { $notNull: true },
              },
              select: ["id", "name", "price", "description"],
            },
          },
        });

      if (!restaurant) {
        throw new Error("Restaurant not found");
      }

      // 2. Fetch orders for analytics (by documentId)
      const orders = await strapi.db.query("api::order.order").findMany({
        where: {
          publishedAt: { $notNull: true },
        },
        select: ["totalAmount"],
        populate: {
          restaurant: {
            select: ["documentId"],
          },
        },
      });

      let totalOrders = 0;
      let totalRevenue = 0;

      for (const order of orders as any[]) {
        if (order.restaurant?.documentId === restaurant.documentId) {
          totalOrders += 1;
          totalRevenue += Number(order.totalAmount || 0);
        }
      }

      // 3. Final response
      return {
        id: restaurant.id,
        name: restaurant.name,
        address: restaurant.address,
        city: restaurant.city,
        rating: restaurant.rating,
        isActive: restaurant.isActive,
        createdAt: restaurant.createdAt,

        analytics: {
          totalOrders,
          totalRevenue,
        },

        foodItems: (restaurant.food_items || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
        })),
      };
    } catch (err) {
      strapi.log.error("restaurant view error", err);
      throw err;
    }
  },
  /* =========================================================
     CREATE
  ========================================================= */

  async createRestaurant(body: any) {
    return await strapi.entityService.create("api::restaurant.restaurant", {
      data: {
        name: body.name,
        address: body.address,
        city: body.city,
        rating: body.rating,
        isActive: true,
      },
    });
  },

  /* =========================================================
     UPDATE
  ========================================================= */

async updateRestaurant(id: number, body: any) {
  const restaurant = await strapi.entityService.update(
    "api::restaurant.restaurant",
    id,
    {
      data: {
        name: body.name,
        address: body.address,
        city: body.city,
        rating: body.rating,
      },
    }
  );

  return restaurant;
},

  /* =========================================================
     DELETE
  ========================================================= */

async deleteRestaurant(id: number) {
  const restaurant = await strapi.entityService.findOne(
    "api::restaurant.restaurant",
    id
  );

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  await strapi.entityService.delete("api::restaurant.restaurant", id);

  return { id };
},

  /* =========================================================
     STATUS TOGGLE
  ========================================================= */

  async toggleRestaurantStatus(id: number, isActive: boolean) {
    return await strapi.entityService.update("api::restaurant.restaurant", id, {
      data: { isActive: isActive },
    });
  },
};
