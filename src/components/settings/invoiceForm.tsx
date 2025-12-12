"use client";

import {
  FieldArrayWithId,
  useFieldArray,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceSchema } from "@/util/schemas/invoice.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../UI/form";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../UI/card";
import { Button } from "../UI/button";
import {
  ArrowLeft,
  Copy,
  DollarSign,
  GripVertical,
  Plus,
  Save,
  Send,
  X,
} from "lucide-react";
import { Input } from "../UI/input";
import { Separator } from "../UI/separator";
import Avatar from "../UI/Avatar";
import { useAppSelector } from "@/store/hooks";
import { Badge } from "../UI/Badge";
import Image from "next/image";
import MinimalTable from "../UI/MinimalTable";
import { ColumnDef } from "@tanstack/react-table";
import { InvoiceItem } from "@/types/finance";
import { AssetsData, GeneralData } from "@/types/branding";
import React, { useRef, useState } from "react";
import DropZone from "./invoiceDropZone";
import { DndProvider, useDrag } from "react-dnd";
import { cn } from "@/util";
import { Collapse } from "@mui/material";
import { HTML5Backend } from "react-dnd-html5-backend";
import PhoneNumberInput from "../UI/phoneNumberInput";
import { Textarea } from "../UI/textarea";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../UI/select";
import DateSelector from "../UI/DateSelector";

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

export const columns: ColumnDef<InvoiceItem>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "total",
    header: "Total",
  },
];

const ACCEPTS = ["field"];

const InvoiceForm = () => {
  const { data } = useAppSelector((state) => state.branding);
  const { assetsData, generalData } = data;

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      name: "",
      due_date: "",
      payment_type: "one-time",
      employer_id: "",
      from: {
        name: "",
        email: "",
        phone: "",
        address: "",
      },
      to: {
        name: "",
        email: "",
        phone: "",
        address: "",
      },
      items: [],
      subtotal: 0,
      discount: 0,
      tax: 0,
      total: 0,
      currency: "",
    },
  });

  const { fields, append, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

  async function onSubmit(values: InvoiceFormValues) {
    console.log("🚀 ~ onSubmit ~ values:", values);
  }

  const [isShake, setIsShake] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<string | null>(null);

  function shake(name: string) {
    setIsShake(name);
    setTimeout(() => {
      setIsShake(null);
    }, 500);
  }

  const handleDrop = (dropZone: any, draggableBlock: any) => {
    const { path: dropZonePath } = dropZone;
    const { path: draggableBlockPath } = draggableBlock;

    // Extract the index of the dragged item
    const draggedIndex = Number(draggableBlockPath.split("-").at(-1));

    // Extract the index of the drop zone item
    const dropZoneIndex = Number(dropZonePath.split("-").at(-1));

    // Perform the reorder
    const newItems = [...fields];
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(dropZoneIndex, 0, removed);

    form.setValue("items", newItems);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
      >
        <CardHeader className="py-4">
          <CardTitle className="text-lg">
            <Button variant="outline" asChild>
              <Link href="/admin/invoices">
                <ArrowLeft />
              </Link>
            </Button>
            Create Invoice
          </CardTitle>
          <CardDescription>Create an invoice for a client</CardDescription>
          <CardAction className="flex gap-2">
            <Button variant="outline">
              <Save /> Save Draft
            </Button>
            <Button type="submit">
              <Send />
              Send Invoice
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className="flex max-h-[calc(100vh-110px)] gap-2">
          <InvoiceCard
            data={form.watch()}
            assetsData={assetsData}
            generalData={generalData}
          />
          <Card className="scroll-bar-hidden max-h-full w-full max-w-lg overflow-auto">
            <CardHeader>
              <CardTitle>Invoice Form</CardTitle>
              <CardDescription>
                Fill in the form to create an invoice
              </CardDescription>
            </CardHeader>
            <Separator className="my-4" />
            <CardContent className="space-y-4">
              <h4 className="text-center text-xs text-muted-foreground">General</h4>
              <FormField
                control={form.control}
                name="due_date"
                defaultValue=""
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Due Date</FormLabel>
                    <DateSelector placeholder="Select Due Date" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="payment_type"
                defaultValue="one-time"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Payment Type</FormLabel>
                    <Select {...field}>
                      <SelectTrigger className="w-full whitespace-nowrap">
                        <SelectValue placeholder="Select Payment Type" />
                      </SelectTrigger>
                      <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
                        <SelectItem value="one-time">One Time</SelectItem>
                        <SelectItem value="recurring">Recurring</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator className="my-4" />
              <h4 className="text-center text-xs text-muted-foreground">From</h4>
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="from.name"
                  defaultValue=""
                  render={({ field }) => (
                    <FormItem className="col-span-2 w-full">
                      <FormLabel>Name</FormLabel>
                      <Input placeholder="Enter Name" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="from.email"
                  defaultValue=""
                  render={({ field }) => (
                    <FormItem className="w-full max-w-xs">
                      <FormLabel>Email</FormLabel>
                      <Input placeholder="Enter Email" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="from.phone"
                  defaultValue=""
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <PhoneNumberInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="from.address"
                  defaultValue=""
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your text"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* <FormField
                control={form.control}
                name="due_date"
                defaultValue=""
                render={({ field }) => (
                  <FormItem className="w-full max-w-xs">
                    <FormLabel>Due Date</FormLabel>
                    <DateSelector placeholder="Select Due Date" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <Separator className="my-4" />
              <h4 className="text-center text-xs text-muted-foreground">To</h4>
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="to.name"
                  defaultValue=""
                  render={({ field }) => (
                    <FormItem className="col-span-2 w-full">
                      <FormLabel>Name</FormLabel>
                      <Input placeholder="Enter Name" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="to.email"
                  defaultValue=""
                  render={({ field }) => (
                    <FormItem className="w-full max-w-xs">
                      <FormLabel>Email</FormLabel>
                      <Input placeholder="Enter Email" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="to.phone"
                  defaultValue=""
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <PhoneNumberInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="to.address"
                  defaultValue=""
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your text"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator className="my-4" />
              <h4 className="text-center text-xs text-muted-foreground">Items</h4>
              <DndProvider backend={HTML5Backend}>
                {fields?.map((field, index) => (
                  <React.Fragment key={field.id}>
                    <DropZone
                      data={{
                        path: `${index}`,
                      }}
                      accepts={ACCEPTS}
                      onDrop={handleDrop}
                      className="min-h-2"
                    />
                    <FieldForm
                      key={field.id}
                      field={field}
                      isShake={isShake}
                      activeField={activeField}
                      setActiveField={setActiveField}
                      form={form}
                      index={index}
                    />
                  </React.Fragment>
                ))}
                <DropZone
                  data={{
                    path: `${fields?.length}`,
                  }}
                  accepts={ACCEPTS}
                  onDrop={handleDrop}
                  className="min-h-2"
                />
              </DndProvider>
              <Button
                onClick={() =>
                  append({
                    name: "Item",
                    description: "",
                    price: 0,
                    quantity: 0,
                    total: 0,
                  })
                }
                variant="outline"
                className="mt-2 w-full"
              >
                <Plus />
                Add Item
              </Button>
              <Separator className="my-4" />
            </CardContent>
          </Card>
        </CardContent>
      </form>
    </Form>
  );
};

const InvoiceCard = ({
  data,
  assetsData,
  generalData,
}: {
  data: InvoiceFormValues;
  assetsData: AssetsData;
  generalData: GeneralData;
}) => {
  return (
    <Card className="invoice-body scroll-bar-hidden max-h-full flex-1 overflow-auto">
      <CardHeader>
        <CardTitle>
          <Avatar
            src={assetsData.invoiceIcon}
            alt={generalData.siteName}
            size={60}
          />
        </CardTitle>
        <CardDescription>
          {generalData.siteDescription.slice(0, 50)}
        </CardDescription>

        <CardAction className="flex flex-col gap-2">
          <div className="flex gap-2 text-sm">
            <span className="text-sm text-muted-foreground">Invoice Date :</span>
            <span className="text-sm font-semibold">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-sm text-muted-foreground">Due date :</span>
            <span className="text-sm font-semibold">
              {data.due_date
                ? new Date(data.due_date).toLocaleDateString()
                : "Not set"}
            </span>
          </div>
        </CardAction>
      </CardHeader>
      <Separator className="my-4" />
      <CardContent>
        <table className="w-full">
          <thead>
            <tr>
              <th
                scope="col"
                className="w-2/5 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                From:
              </th>
              <th
                scope="col"
                className="w-2/5 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                To:
              </th>
              <th
                scope="col"
                className="w-1/5 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Payment Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            <tr>
              <td className="w-2/5 py-3 text-sm text-gray-900">
                <div className="text-sm font-medium">
                  {data.from.name || (
                    <span className="text-sm text-muted-foreground">Add Name</span>
                  )}
                  <br />
                  {data.from.address || (
                    <span className="text-sm text-muted-foreground">Add Address</span>
                  )}
                  <br />
                  Email :{" "}
                  <a href={`mailto:${data.from.email}`} className="text-sm">
                    {data.from.email || (
                      <span className="text-sm text-muted-foreground">Add Email</span>
                    )}
                  </a>
                  <br />
                  Phone :{" "}
                  {data.from.phone || (
                    <span className="text-sm text-muted-foreground">Add Phone</span>
                  )}
                </div>
              </td>
              <td className="w-2/5 py-3 text-sm text-gray-900">
                <div className="text-sm font-medium">
                  {data.to.name || (
                    <span className="text-sm text-muted-foreground">Add Name</span>
                  )}
                  <br />
                  {data.to.address || (
                    <span className="text-sm text-muted-foreground">Add Address</span>
                  )}
                  <br />
                  Email :{" "}
                  <a href={`mailto:${data.to.email}`} className="text-sm">
                    {data.to.email || (
                      <span className="text-sm text-muted-foreground">Add Email</span>
                    )}
                  </a>
                  <br />
                  Phone :{" "}
                  {data.to.phone || (
                    <span className="text-sm text-muted-foreground">Add Phone</span>
                  )}
                </div>
              </td>
              <td className="w-1/5 py-3">
                <div className="flex flex-col gap-2 text-sm text-gray-900">
                  <Badge variant="error" className="w-fit">
                    Due to 10 days
                  </Badge>
                  <Image
                    src="https://crms.dreamstechnologies.com/html/template/assets/img/icons/invoice-qr.png"
                    alt="invoice-qr"
                    width={60}
                    height={60}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <Separator className="my-4" />
        <div className="space-y-2">
          <p className="text-sm">
            <span className="text-sm text-muted-foreground">Invoice For</span> :
            Business Plan
          </p>
          <MinimalTable columns={columns} data={data.items as InvoiceItem[]} />
          <div className="flex w-full justify-end">
            <div className="flex-1">
              <p className="max-w-60 text-xs text-muted-foreground">
                This quotation is valid for 30 days and the set prices will not
                be
              </p>
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="text-sm">Subtotal:</p>
                <p className="text-sm font-semibold">{data.subtotal}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">Discount:</p>
                <p className="text-sm font-semibold">{data.discount}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">Tax:</p>
                <p className="text-sm font-semibold">{data.tax}</p>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <p className="text-sm">Total</p>
                <p className="text-sm font-semibold">{data.total}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <Separator className="my-6" />
      <CardFooter className="flex w-full items-center justify-center py-6">
        <CardDescription className="max-w-md text-center text-xs">
          This quote created by {generalData.siteName} and is protected by
          {generalData.siteName} terms and conditions, it cannot be reproduced
          or modified without permission
        </CardDescription>
      </CardFooter>
    </Card>
  );
};

type Field = FieldArrayWithId<InvoiceFormValues, "items", "id">;

const FieldForm = ({
  field,
  isShake,
  activeField,
  setActiveField,
  form,
  index,
}: {
  field: Field;
  form: UseFormReturn<InvoiceFormValues>;
  isShake: string | null;
  activeField: string | null;
  setActiveField: (id: string | null) => void;
  index: number;
}) => {
  const dragRef = useRef<HTMLDivElement>(
    null,
  ) as React.RefObject<HTMLDivElement>;
  const previewRef = useRef<HTMLDivElement>(
    null,
  ) as React.RefObject<HTMLDivElement>;

  const [{ isDragging }, drag, preview] = useDrag({
    type: "field",
    item: {
      type: "field",
      id: "id",
      path: "path",
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(dragRef);
  preview(previewRef);

  return (
    <div
      ref={previewRef}
      style={{ opacity }}
      className={cn(
        "rounded-[4px] border border-gray-200",
        isShake === field.id ? "animate-shake border border-red-400" : "",
      )}
    >
      <div className={`${activeField === field.id ? "border-b" : ""} flex`}>
        <div
          ref={dragRef}
          tabIndex={-1}
          className="h-full cursor-grabbing rounded-none border-r border-solid border-gray-200 p-3"
        >
          <GripVertical className="h-4 w-4" />
        </div>
        <div
          className={
            "flex-1 justify-start rounded-none p-2 text-sm normal-case text-muted-foreground"
          }
          onClick={() =>
            setActiveField(activeField === field.id ? null : field.id)
          }
        >
          {field.name} <span className="text-xs">({field.name})</span>
        </div>
        <Button
          className="h-full rounded-none border-b-0 border-l border-r-0 border-t-0 p-3"
          variant="outline"
        >
          <Copy />
        </Button>
        <Button
          className="h-full rounded-none border-b-0 border-l border-r-0 border-t-0 p-3"
          variant="outline"
        >
          <X />
        </Button>
      </div>
      <Collapse in={activeField === field.id}>
        <div className="grid grid-cols-2 gap-2 p-2">
          <FormField
            control={form.control}
            name={`items.${index}.name`}
            render={({ field }) => (
              <FormItem className="col-span-2 flex flex-row items-center space-x-2">
                <FormLabel className="whitespace-nowrap">Item Name </FormLabel>
                <FormControl className="max-w-sm">
                  <Input placeholder="Item Name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`items.${index}.price`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2">
                <FormLabel className="whitespace-nowrap">Price </FormLabel>
                <FormControl className="max-w-sm">
                  <Input type="number" placeholder="Price" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`items.${index}.quantity`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2">
                <FormLabel className="whitespace-nowrap">Quantity </FormLabel>
                <FormControl className="max-w-sm">
                  <Input type="number" placeholder="Quantity" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`items.${index}.description`}
            render={({ field }) => (
              <FormItem className="col-span-2 flex flex-row items-center space-x-2">
                <FormLabel className="whitespace-nowrap">
                  Description{" "}
                </FormLabel>
                <FormControl className="max-w-sm">
                  <Textarea placeholder="Description" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </Collapse>
    </div>
  );
};

export default InvoiceForm;
