"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import { Badge } from "@/components/UI/Badge";
import { Button } from "@/components/UI/button";
import { Addon } from "@/types/finance";
import { formatMoney } from "@/util/general";
import { ShoppingCart } from "lucide-react";

interface AddonCardProps {
  addon: Addon;
  onBuy: (addon: Addon) => void;
  index: number;
}

export default function AddonCard({ addon, onBuy, index }: AddonCardProps) {
  if (addon.status !== "active" || !addon.active) return null;

  return (
    <div>
      <Card
        className={`flex h-full flex-col justify-between rounded-2xl shadow-md transition ${
          addon.isHighlighted ? "border-2 border-blue-500" : "border"
        }`}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">{addon.name}</CardTitle>
            {addon.badge && <Badge variant="info">{addon.badge}</Badge>}
          </div>
          <CardDescription className="mt-1 line-clamp-2 text-sm">
            {addon.description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-blue-600">
              ${formatMoney(addon.totalPrice)}
            </span>
            {addon.discountPercent > 0 && (
              <span className="text-muted-foreground text-sm line-through">
                ${formatMoney(addon.price)}
              </span>
            )}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {addon.features.jobs && (
              <div className="rounded-lg bg-gray-50 p-2 text-center">
                <p className="font-medium">{addon.features.jobs}</p>
                <p className="text-muted-foreground text-xs">Jobs</p>
              </div>
            )}
            {addon.features.unlocks && (
              <div className="rounded-lg bg-gray-50 p-2 text-center">
                <p className="font-medium">{addon.features.unlocks}</p>
                <p className="text-muted-foreground text-xs">Unlocks</p>
              </div>
            )}
            {addon.features.invites && (
              <div className="rounded-lg bg-gray-50 p-2 text-center">
                <p className="font-medium">{addon.features.invites}</p>
                <p className="text-muted-foreground text-xs">Invites</p>
              </div>
            )}
            {addon.features.views && (
              <div className="rounded-lg bg-gray-50 p-2 text-center">
                <p className="font-medium">{addon.features.views}</p>
                <p className="text-muted-foreground text-xs">Views</p>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <Badge variant="neutral" className="text-xs">
            VAT {addon.vatPercent}%
          </Badge>
          <Button onClick={() => onBuy(addon)} className="gap-2">
            <ShoppingCart className="h-4 w-4" /> Buy
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
