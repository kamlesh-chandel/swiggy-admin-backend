export default {
  async analytics(ctx) {
    const data = await strapi
      .service("api::dashboard.dashboard")
      .getAnalytics();

    ctx.body = data;
  },
};
