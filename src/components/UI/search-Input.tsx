"use client";
import { createUrl } from "@/util";
import { TextField } from "@mui/material";
import debounce from "lodash.debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ComponentProps, KeyboardEvent, Suspense, useState } from "react";

interface SearchProps extends ComponentProps<typeof TextField> {
  onClick?: () => void;
  pathname?: string;
  children?: React.ReactNode;
  isBounce?: boolean;
  formClassName?: string;
  keyParam?: string;
}

const Input: React.FC<SearchProps> = ({
  onClick,
  pathname: initialPathname,
  children,
  isBounce,
  keyParam = "q",
  ...props
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  // const currentPage = pathname.split("/").pop();
  const newPathname = initialPathname || pathname;
  const initialSearchText = searchParams.get(keyParam) || "";
  const [query, setQuery] = useState(initialSearchText);

  function onSubmit() {
    const newParams = new URLSearchParams(searchParams.toString());
    if (query) {
      newParams.set(keyParam, query);
      newParams.delete("page");
    } else {
      newParams.delete(keyParam);
    }
    onClick?.();
    router.push(createUrl(newPathname, newParams));
  }

  const updateSearchParams = debounce((value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set(keyParam, value);
    newParams.delete("page");
    router.push(createUrl(pathname, newParams));
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (isBounce) {
      updateSearchParams(value);
    }
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      onSubmit();
    }
  };
  return (
    <TextField
      {...props}
      value={query}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
};
const SearchInputForm: React.FC<SearchProps> = ({
  onClick,
  pathname: initialPathname,
  children,
  isBounce,
  formClassName,
  keyParam = "q",
  ...props
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const newPathname = initialPathname || pathname;
  const initialSearchText = searchParams.get(keyParam) || "";
  const [query, setQuery] = useState(initialSearchText);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams.toString());
    if (query) {
      newParams.set(keyParam, query);
      newParams.delete("page");
    } else {
      newParams.delete(keyParam);
    }
    onClick?.();
    router.push(createUrl(newPathname, newParams));
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };
  return (
    <form onSubmit={onSubmit} className={formClassName}>
      <TextField {...props} value={query} onChange={handleChange} />
      {children}
    </form>
  );
};

const SearchInput: React.FC<SearchProps> = (props) => {
  return props.children ? (
    <Suspense>
      <SearchInputForm {...props} />
    </Suspense>
  ) : (
    <Suspense>
      <Input {...props} />
    </Suspense>
  );
};
export default SearchInput;
