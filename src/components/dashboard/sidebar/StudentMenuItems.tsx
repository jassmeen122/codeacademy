
import { MenuItem } from "@/types/sidebar";
import { STUDENT_NAVIGATION } from "@/config/navigation";

export const studentMenuItems: MenuItem[] = STUDENT_NAVIGATION.map(item => ({
  title: item.title,
  icon: item.icon,
  href: item.href,
}));
