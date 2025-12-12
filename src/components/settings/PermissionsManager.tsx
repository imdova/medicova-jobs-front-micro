"use client";

import { useCallback } from "react";
import { Checkbox } from "@/components/UI/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/UI/popover";
import { Button } from "@/components/UI/button";
import { Settings } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../UI/Table";
import { Label } from "../UI/label";
import { All_Permissions_Categorized } from "@/constants/permissions";


type PermissionsTableProps = {
  value: string[];
  onChange: (next: string[]) => void;
};

export default function PermissionsTable({
  value,
  onChange,
}: PermissionsTableProps) {
  const toggle = useCallback(
    (key: string) => {
      if (!key) return;
      const exists = value.includes(key);
      const next = exists ? value.filter((k) => k !== key) : [...value, key];
      onChange(next);
    },
    [value, onChange],
  );

  // toggle all permissions in the entire table
  const toggleAll = (checked: boolean) => {
    const allKeys = All_Permissions_Categorized.flatMap((group) => [
      ...Object.values(group.core),
      ...(group.extras ? Object.values(group.extras) : []),
    ]).filter(Boolean) as string[];

    onChange(checked ? allKeys : []);
  };

  // toggle all permissions in one group
  const toggleGroup = (groupId: string, checked: boolean) => {
    const group = All_Permissions_Categorized.find((g) => g.id === groupId);
    if (!group) return;

    const groupKeys = [
      ...Object.values(group.core),
      ...(group.extras ? Object.values(group.extras) : []),
    ].filter(Boolean) as string[];

    let next: string[];
    if (checked) {
      next = Array.from(new Set([...value, ...groupKeys]));
    } else {
      next = value.filter((k) => !groupKeys.includes(k));
    }

    onChange(next);
  };

  // helpers for "indeterminate" state
  const allKeys = All_Permissions_Categorized.flatMap((group) => [
    ...Object.values(group.core),
    ...(group.extras ? Object.values(group.extras) : []),
  ]).filter(Boolean) as string[];

  const allChecked = allKeys.every((k) => value.includes(k));
  const someChecked = !allChecked && allKeys.some((k) => value.includes(k));

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={allChecked || (someChecked && "indeterminate")}
                  onCheckedChange={(checked) => toggleAll(!!checked)}
                />
                <span>Module</span>
              </div>
            </TableHead>
            <TableHead className="text-xs">Create</TableHead>
            <TableHead className="text-xs">Edit</TableHead>
            <TableHead className="text-xs">Delete</TableHead>
            <TableHead className="text-xs">Read</TableHead>
            <TableHead className="text-xs">Manage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {All_Permissions_Categorized.map((group) => {
            const groupKeys = [
              ...Object.values(group.core),
              ...(group.extras ? Object.values(group.extras) : []),
            ].filter(Boolean) as string[];

            const groupAllChecked = groupKeys.every((k) => value.includes(k));
            const groupSomeChecked =
              !groupAllChecked && groupKeys.some((k) => value.includes(k));

            return (
              <TableRow key={group.id} className="border-t">
                {/* Group name */}
                <TableCell className="p-3 text-xs font-medium">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={
                        groupAllChecked || (groupSomeChecked && "indeterminate")
                      }
                      onCheckedChange={(checked) =>
                        toggleGroup(group.id, !!checked)
                      }
                    />
                    <span>{group.name}</span>
                  </div>
                </TableCell>

                {/* Core permissions */}
                {Object.entries(group.core).map(([label, key]) => (
                  <TableCell key={label} className="p-3 text-center text-xs">
                    {key ? (
                      <Checkbox
                        checked={value.includes(key)}
                        onCheckedChange={() => toggle(key)}
                      />
                    ) : (
                      <Checkbox disabled />
                    )}
                  </TableCell>
                ))}

                {/* Extras inside popover */}
                <TableCell className="p-3 text-center">
                  {group.extras && Object.keys(group.extras).length > 0 ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="iconSm">
                          <Settings className="size-3" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56">
                        <div className="space-y-2">
                          {Object.entries(group.extras).map(([label, key]) =>
                            key ? (
                              <Label
                                key={key}
                                htmlFor={key}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={key}
                                  checked={value.includes(key)}
                                  onCheckedChange={() => toggle(key)}
                                />
                                <span className="text-xs">{label}</span>
                              </Label>
                            ) : (
                              <div
                                key={label}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox disabled />
                                <span className="text-muted-foreground text-xs">
                                  {label}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    "-" // fallback if no extras
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
