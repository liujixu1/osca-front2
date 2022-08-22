// Imports
import Vue from "vue";
import Router from "vue-router";
import { trailingSlash } from "@/util/helpers";
import { layout, route } from "@/util/routes";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash) return { selector: to.hash };
    if (savedPosition) return savedPosition;

    return { x: 0, y: 0 };
  },
  routes: [
    layout("Default", [
      {
        path: "",
        hidden: true,
        isRoot: true,
        redirect: "components/dashboard",
      },
      route("Dashboard", null, "components/dashboard"),

      // Pages
      route("UserProfile", null, "components/profile"),

      // Components
      route("Notifications", null, "components/notifications"),
      route("Icons", null, "components/icons"),
      route("Typography", null, "components/typography"),

      // Tables
      route("Regular Tables", null, "tables/regular"),

      // Maps
      route("Google Maps", null, "maps/google"),
      route("Code Snippet", { default: "CodeSnippetScan" }, "codesnippet"),
      route("Sca", { default: "sca/Sca" }, "sca"),
      route("About Me", null, "aboutme"),
      route("Login Loading", { default: "login/LoginLoading" }, "loginloading"),

      route("Lv Meng", { default: "lvMeng/test" }, "components/test"),
      route("Lv Meng", { default: "lvMeng/test" }, "components/tes5t2"),
    ]),
  ],
});

// router.beforeEach((to, from, next) => {
//   return to.path.endsWith("/") ? next() : next(trailingSlash(to.path));
// });

export default router;
