import Scatter2d from "../components/Scatter2d.vue";
import Scatter3d from "../components/Scatter3d.vue";
import Scatter3d2 from "../components/Scatter3d2.vue";
import BarLayout from "@/components/layout/index";
import BarDashboard from "@/components/dashboard/index";

const routes = [
  {
    path: "/",
    // component: BarLayout,
    redirect: "/main"
  },
  {
    path: "/main",
    component: BarLayout,
    redirect: "/main/dashboard",
    children: [
      { path: "dashboard", component: BarDashboard },
      { path: "scatter2d", component: Scatter2d },
      { path: "scatter3d", component: Scatter3d },
      { path: "scatter3d2", component: Scatter3d2 }
    ]
  }
];

export default routes;
