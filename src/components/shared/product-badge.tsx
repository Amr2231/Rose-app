import { Badge } from "@/components/ui/badge";
import { ProductBadgeProps } from "@/lib/types/product";
import { useTranslations } from "next-intl";

export default function ProductBadge({
  quantity,
  sold = 0,
}: ProductBadgeProps) {
  // Translation
  const t = useTranslations("product.badge");

  const isHot = sold >= 100;
  const isOutOfStock = quantity <= 0;
  const showHot = isHot;
  const showNew = !isHot;
  const showOutOfStock = isOutOfStock;

  return (
    <div className="absolute top-2 right-2 flex gap-1 z-10">
      {showNew && !showOutOfStock && <Badge variant="new">{t("new")}</Badge>}

      {showHot && <Badge variant="hot">{t("hot")}</Badge>}

      {showOutOfStock && (
        <Badge variant="outOfStock">{t("out-of-stock")}</Badge>
      )}
    </div>
  );
}
