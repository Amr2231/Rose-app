"use client";

import Image from "next/image";
import { Heart, LayoutDashboard, MapPinPen, ShoppingCart, User } from "lucide-react";
import Navbar from "./navbar";
import { cn } from "@/lib/utils/tailwind-merge";
import Notifications from "@/components/skeletons/notifications/notifications";
import ToggleLanguage from "@/components/features/toggle-language";
import ThemeToggle from "@/components/features/theme-toggle";
import LoginPopup from "@/components/skeletons/login-popup/login-popup";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useGetCart } from "../../products/[id]/_hooks/use-get-cart";
import { DeliveryLocationDialog } from "@/app/[locale]/(website)/checkout/_components/address-dialog";
import { Address } from "@/lib/types/address";
import { useTranslations } from "next-intl";
import SearchModule from "./search-component/module";
import { useSession } from "next-auth/react";

export default function Header() {
  const t = useTranslations();
  const tHeader = useTranslations("header");
  const { cart } = useGetCart();

  // State for location dialog
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState("Cairo");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const isAdmin = session?.user?.role === "ADMIN";

  const headerList = [
    ...(isAdmin
      ? [
          {
            icons: [
              <LayoutDashboard
                key="dashboard-icon"
                className="text-zinc-700 text-sm font-normal cursor-pointer dark:text-zinc-50"
                width={24}
                height={24}
              />,
            ],
            text: tHeader("dashboard"),
            link: "/dashboard",
            // Rendered like the account item below (always a clickable
            // Link), not the special login-hover item.
            isAccountLike: true,
          },
        ]
      : []),
    {
      icons: [
        <User
          key="user-icon"
          className="text-zinc-700 text-sm font-normal cursor-pointer dark:text-zinc-50"
          width={24}
          height={24}
        />,
      ],
      text: isLoggedIn ? tHeader("profile") : tHeader("login"),
      link: isLoggedIn ? "/profile" : "/login",
      // The item that gets the hover login-popup when logged out. It used
      // to be identified by `index === 0`, but that index shifts to 1
      // whenever the admin Dashboard item is prepended above - which
      // silently dropped the <Link> wrapper here (and the hover popup)
      // for admin accounts. Identify it explicitly instead.
      isAccountItem: true,
    },
    {
      icons: [
        <Link href="/wishlist" key="heart-link">
          <Heart
            key="heart-icon"
            className="text-zinc-700 text-sm font-normal cursor-pointer dark:text-zinc-50"
            width={24}
            height={24}
          />
        </Link>,
        <div className="relative" key="cart">
          <Link href={isLoggedIn ? "/cart" : "/login"}>
            <ShoppingCart
              key="cart-icon"
              className="text-zinc-700 text-sm font-normal cursor-pointer dark:text-zinc-50 mx-2"
              width={24}
              height={24}
            />
          </Link>
          <p className="absolute w-5 h-5 rounded-full bg-red-600 text-center text-white -top-[0.82rem] right-0">
            {isLoggedIn ? cart?.numOfCartItems : 0}
          </p>
        </div>,
        <Notifications key="notifications" />,
      ],
      // Same index problem as above: the vertical divider styling used to
      // target this item via `index === 1`, which only lined up when there
      // was no Dashboard item ahead of it. Give it its own flag.
      isCartGroup: true,
    },
  ];
  useEffect(() => {
    const saved = localStorage.getItem("selectedAddress");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSelectedAddress(parsed);
      setCurrentCity(parsed.city);
    }
  }, []);

  // Handle address selection
  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
    setCurrentCity(address.city);
    localStorage.setItem("selectedAddress", JSON.stringify(address));
  };

  // state to manage login popup visibility
  const [isLoginHovered, setIsLoginHovered] = useState(false);

  return (
    <>
      <header className="px-3 sm:px-5 flex flex-wrap items-center justify-between gap-y-2 py-2 text-sm">
        <div className="logo me-2 shrink-0">
          <Image src="/images/logo1.svg" alt="Rose Logo" width={85} height={80} className="w-16 h-auto sm:w-[85px]" />
        </div>

        {/* Delivery Location Trigger */}
        <div className="ms-2 sm:ms-4 me-2 sm:me-4 order-3 sm:order-none w-full sm:w-auto">
          <div
            className="flex flex-col text-center sm:text-start cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 px-3 py-1 rounded-lg transition-colors"
            onClick={() => setIsLocationDialogOpen(true)}
          >
            <p className="font-normal text-zinc-500 text-xs">{t("deliver")}</p>
            <span className="font-medium text-sm sm:text-base text-maroon-700 flex items-center gap-1 justify-center sm:justify-start">
              <MapPinPen size={18} />
              {selectedAddress?.city || currentCity}
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-wrap sm:flex-nowrap items-center gap-y-2 min-w-full sm:min-w-0">
          <div className="w-full sm:w-auto sm:flex-1">
            <SearchModule />
          </div>

          <ul className="flex items-center flex-wrap justify-center sm:justify-start ms-0 sm:ms-2 w-full sm:w-auto">
            {headerList.map((item, index) => (
              <li
                key={index}
                className={cn(
                  "flex items-center gap-1 px-2 sm:px-3 cursor-pointer",
                  item.isCartGroup && "border-x h-12 relative dark:border-x-zinc-700"
                )}
              >
                {item.isAccountItem && !isLoggedIn ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setIsLoginHovered(true)}
                    onMouseLeave={() => setIsLoginHovered(false)}
                  >
                    <Link
                      href={item.link ?? "/login"}
                      className="flex items-center gap-1 cursor-pointer"
                    >
                      {item.icons?.map((icon, i) => (
                        <span key={i}>{icon}</span>
                      ))}
                      <span>{item.text}</span>
                    </Link>

                    {isLoginHovered && (
                      <div className="absolute top-full end-0 z-50">
                        <LoginPopup />
                      </div>
                    )}
                  </div>
                ) : item.isAccountItem || item.isAccountLike ? (
                  <Link
                    href={item.link ?? "/profile"}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    {item.icons?.map((icon, i) => (
                      <span key={i}>{icon}</span>
                    ))}
                    <span>{item.text}</span>
                  </Link>
                ) : (
                  <>
                    {item.icons
                      ? item.icons.map((icon, iconIndex) => (
                          <span key={iconIndex}>{icon}</span>
                        ))
                      : null}
                    {item.text ? <span>{item.text}</span> : null}
                  </>
                )}
              </li>
            ))}

            <li className="px-3">
              <ToggleLanguage />
            </li>
            <li className="px-3">
              <ThemeToggle />
            </li>
          </ul>
        </div>
      </header>

      <Navbar />

      {/* Delivery Location Dialog */}
      <DeliveryLocationDialog
        open={isLocationDialogOpen}
        onOpenChange={setIsLocationDialogOpen}
        onSelectAddress={handleSelectAddress}
      />
    </>
  );
}
