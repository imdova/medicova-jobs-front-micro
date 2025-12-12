import React, { forwardRef, useEffect, useState } from "react";
import { Input } from "@/components/UI/input";
import { Button } from "@/components/UI/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/UI/command";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/UI/popover";
import { ChevronDownIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCountries } from "@/store/slices/locationSlice";
import parsePhoneNumberFromString, { CountryCode } from "libphonenumber-js";
import Flag from "./flagitem";

const formatCode = (code: string): string => {
  return code.startsWith("+") ? code : `+${code}`;
};

export const PhoneNumberInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  const [open, setOpen] = React.useState(false);

  const {
    countries: { data: countries },
  } = useAppSelector((state) => state.location);
  const dispatch = useAppDispatch();

  const [countryCode, setCountryCode] = useState<string>("20"); // Default to Egypt
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  useEffect(() => {
    if (countries.length === 0) {
      dispatch(fetchCountries());
    }
  }, [dispatch, countries.length]);

  const handleCountryChange = (value: string) => {
    setCountryCode(value);
    validateAndFormatPhone(phoneNumber, value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputNumber = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    setPhoneNumber(inputNumber);
    validateAndFormatPhone(inputNumber, countryCode);
  };

  const validateAndFormatPhone = (input: string, code: string) => {
    const country = countries.find((x) => x.phonecode === code);
    if (!country) return;

    const phoneNumberObj = parsePhoneNumberFromString(
      input,
      country.isoCode as CountryCode,
    );

    if (props.onChange) {
      const syntheticEvent = {
        target: { value: phoneNumberObj?.number || "" },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      props.onChange(syntheticEvent);
    }
  };
  const item = countries.find((x) => x.phonecode === countryCode);
  return (
    <div className="flex rounded-md shadow-xs" ref={ref}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            type="button"
            aria-expanded={open}
            className="rounded-e-none shadow-none focus-visible:z-1"
          >
            <Flag
              code={item?.isoCode.toLowerCase() || "eg"}
              name={item?.name || "Egypt"}
              width={20}
              height={15}
            />
            {countryCode}
            <ChevronDownIcon className="text-muted-foreground size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search Country..." />
            <CommandList>
              <CommandEmpty>No Country found.</CommandEmpty>
              <CommandGroup>
                {countries.map((country, index) => (
                  <CommandItem
                    key={country.phonecode + "-" + index}
                    value={`${country.name.toLowerCase()} ${country.phonecode}`} // 👈 searchable by both
                    onSelect={() => {
                      handleCountryChange(country.phonecode);
                      setOpen(false);
                    }}
                  >
                    <Flag
                      code={country.isoCode.toLowerCase()}
                      name={country.name}
                      className="h-5 w-5"
                    />
                    {`${country.name} (${formatCode(country.phonecode)})`}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Input
        {...props}
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneChange}
        placeholder="Phone number"
        className="w-full rounded-s-none"
      />
    </div>
  );
});

PhoneNumberInput.displayName = "PhoneNumberInput";

export default PhoneNumberInput;
