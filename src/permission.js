import router from "./router";
import store from "@/store";
function getUserInfo() {
  console.log("获取信息");
  store.set("user/userInfo", { a: 123 });
}
router.beforeEach(async (to, from, next) => {
  if (from.fullPath === "/") {
    // await getUserInfo();
    next();
  } else {
    next();
  }
});
