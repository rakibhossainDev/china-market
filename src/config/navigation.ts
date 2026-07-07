import { Home, Search, ShoppingCart, User, Package, Plane, Monitor, Shirt, Laptop, LucideIcon } from 'lucide-react';

export interface NavLink {
  label: string;
  href: string;
  icon?: LucideIcon;
}

export const desktopSidebarLinks: NavLink[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Bulk Order', href: '/bulk-order', icon: Package },
  { label: 'Track Sourcing', href: '/track', icon: Plane },
  { label: 'Account', href: '/account', icon: User },
  { label: 'Electronics', href: '/category/electronics', icon: Monitor },
  { label: 'Fashion', href: '/category/fashion', icon: Shirt },
  { label: 'Gadgets', href: '/category/gadgets', icon: Laptop },
];

export const mobileBottomNavLinks: NavLink[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Search', href: '/search', icon: Search },
  { label: 'Cart', href: '/cart', icon: ShoppingCart },
  { label: 'Profile', href: '/profile', icon: User },
];
