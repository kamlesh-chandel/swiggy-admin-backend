import { error } from "console";

export default {
  async getAnalytics() {
    try {
      /* ===================== COUNTS ===================== */

      const [totalOrders, totalRestaurants, totalCustomers] = await Promise.all(
        [
          strapi.entityService.count("api::order.order", {}),
          strapi.entityService.count("api::restaurant.restaurant"),
          strapi.entityService.count("api::customer.customer"),
        ],
      );

      /* ===================== REVENUE ===================== */

      const orders = await strapi.entityService.findMany("api::order.order", {
        fields: ["totalAmount"],
        pagination: { pageSize: 10000 },
      });

      const totalRevenue = orders.reduce(
        (sum, order) => sum + Number(order.totalAmount || 0),
        0,
      );

      /* ===================== ORDERS BY STATUS ===================== */

      const statusOrders = await strapi.entityService.findMany(
        "api::order.order",
        {
          fields: ["currentStatus"],
          pagination: { pageSize: 10000 },
        },
      );

      const groupedStatus: Record<string, number> = {};

      for (const order of statusOrders) {
        const status = order.currentStatus || "unknown";
        groupedStatus[status] = (groupedStatus[status] || 0) + 1;
      }
const capitalizeFirst = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);
      const ordersByStatus = Object.entries(groupedStatus).map(
        ([status, value]) => ({
          status: capitalizeFirst(status),
          value,
        }),
      );

      /* ===================== TOP RESTAURANTS (BY REVENUE) ===================== */

      const ordersWithRestaurant = (await strapi.entityService.findMany(
        "api::order.order",
        {
          fields: ["totalAmount"],
          populate: {
            restaurant: {
              fields: ["name"],
            },
          },
          pagination: { pageSize: 10000 },
        },
      )) as Array<{
        totalAmount?: number;
        restaurant?: { name?: string };
      }>;

      const restaurantRevenueMap: Record<string, number> = {};

      for (const order of ordersWithRestaurant) {
        const restaurantName = order.restaurant?.name || "Unknown";

        restaurantRevenueMap[restaurantName] =
          (restaurantRevenueMap[restaurantName] || 0) +
          Number(order.totalAmount || 0);
      }

      const topRestaurants = Object.entries(restaurantRevenueMap)
        .map(([name, revenue]) => ({
          name,
          revenue,
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // ===== Orders trend (last 7 days) =====
      // ===== Orders trend (last 7 days) =====
      /* ===================== ORDERS TREND (LAST 7 DAYS) ===================== */
      /* ===================== ORDERS TREND (LAST 7 DAYS FROM TODAY) ===================== */

  const rawOrders = await strapi.db.query("api::order.order").findMany({
    where: {
      publishedAt: { $notNull: true },
    },
    select: ["createdAt"],
  });

      const grouped: Record<string, number> = {};

      // group using LOCAL DATE (most reliable)
for (const order of rawOrders as Array<{ createdAt?: Date }>) {
  if (!order.createdAt) continue;

  const d = new Date(order.createdAt);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  const key = `${year}-${month}-${day}`;

  grouped[key] = (grouped[key] || 0) + 1;
}

      // today (local system date)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // build last 7 days from today
      const trend: { date: string; orders: number }[] = [];

      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");

        const key = `${year}-${month}-${day}`;

        trend.push({
          date: key,
          orders: grouped[key] || 0,
        });
      }
      /* ===================== FINAL RESPONSE ===================== */
      return {
        dashboardStats: {
          totalOrders,
          totalRevenue,
          totalCustomers,
        },
        ordersByStatus,
        topRestaurants,
        ordersTrend: trend,
      };
    } catch (error) {
      strapi.log.error("dashboard analytics error:", error);
      throw error;
    }
  },
};
