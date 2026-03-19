export default {
  routes: [
    {
      method: "GET",
      path: "/dashboard/analytics",
      handler: "dashboard.analytics",
      config: { auth: {} },
    },
  ],
};
