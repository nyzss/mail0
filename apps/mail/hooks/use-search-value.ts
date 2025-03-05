import { DateRange } from "react-day-picker";
import { atom, useAtom } from "jotai";
import { format } from "date-fns";

type Config = {
  value: string;
  highlight: string;
  folder: string;
  mode: boolean;
};

const configAtom = atom<Config>({
  value: "",
  highlight: "",
  folder: "",
  mode: false,
});

export function useSearchValue() {
  return useAtom(configAtom);
}

export type SearchForm = {
  subject: string;
  from: string;
  to: string;
  q: string;
  dateRange: DateRange;
  category: string;
  folder: string;
};

/**
 * https://support.google.com/mail/answer/7190
 */
export const buildSearchQuery = (data: SearchForm): string => {
  let generalQuery = data.q;

  const filters = [
    generalQuery,
    data.from ? `from:(${data.from})` : "",
    data.to ? `to:(${data.to})` : "",
    data.subject ? `subject:(${data.subject})` : "",
    data.dateRange.from ? `after:${format(data.dateRange.from, "MM/dd/yyyy")}` : "",
    data.dateRange.to ? `before:${format(data.dateRange.to, "MM/dd/yyyy")}` : "",
    data.category ? `category:(${data.category})` : "",
  ];

  return filters.filter(Boolean).join(" ");
};
