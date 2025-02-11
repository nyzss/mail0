import { ScrollArea } from "@/components/ui/scroll-area";
import { useMail } from "@/components/mail/use-mail";
import { useThread } from "@/hooks/use-threads";
import { ComponentProps, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "../ui/skeleton";
import { InitialThread } from "@/types";
import { cn } from "@/lib/utils";

interface MailListProps {
  items: InitialThread[];
}

const Thread = ({ id }: { id: string }) => {
  const [mail, setMail] = useMail();
  const { data } = useThread(id);

  const isMailSelected = useMemo(
    () => (data && data.message ? data.message.id === mail.selected : false),
    [data && data.message, mail.selected],
  );

  const handleMailClick = () => {
    if (!data) return;
    if (isMailSelected) {
      setMail({
        selected: null,
      });
    } else {
      setMail({
        ...mail,
        selected: data.message.id,
      });
    }
  };
  return data ? (
    <div
      onClick={handleMailClick}
      key={data.message.id}
      className={cn(
        "group flex cursor-pointer flex-col items-start border-b px-4 py-4 text-left text-sm transition-all hover:bg-accent",
        data.message.unread && "",
        isMailSelected ? "bg-accent" : "",
      )}
    >
      <div className="flex w-full flex-col gap-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            {data.total > 1 && (
              <p className="rounded-full border border-muted-foreground px-1.5 py-0.5 text-xs font-bold">
                {data.total}
              </p>
            )}
            <p
              className={cn(
                data.message.unread ? "font-bold" : "font-medium",
                "text-md flex items-center gap-1 opacity-70 group-hover:opacity-100",
              )}
            >
              {data.message.sender.name}{" "}
              {data.message.unread ? (
                <span className="ml-1 size-2 rounded-full bg-blue-500" />
              ) : null}
            </p>
          </div>
          <p className="pr-2 text-xs font-normal opacity-70 group-hover:opacity-100">Feb 10</p>
        </div>
        <p className="mt-1 text-xs font-medium opacity-70 group-hover:opacity-100">
          {data.message.subject}
        </p>
        <p className="text-[12px] font-medium leading-tight opacity-40 group-hover:opacity-100">
          {data.message.title}
        </p>
      </div>
      <MailLabels labels={data.message.tags} />
    </div>
  ) : (
    <Skeleton />
  );
};

export function MailList({ items }: MailListProps) {
  // TODO: add logic for tags filtering & search
  return (
    <ScrollArea className="" type="auto">
      <div className="flex flex-col pt-0">
        {items.map((item) => (
          <Thread key={item.id} id={item.id} />
        ))}
      </div>
    </ScrollArea>
  );
}
function MailLabels({ labels }: { labels: string[] }) {
  if (!labels.length) return null;

  return (
    <div className={cn("mt-2 flex select-none items-center gap-2")}>
      {labels.map((label) => (
        <Badge key={label} className="rounded-md" variant={getDefaultBadgeStyle(label)}>
          <p className="text-xs font-medium lowercase opacity-70">{label.replace(/_/g, " ")}</p>
        </Badge>
      ))}
    </div>
  );
}

function getDefaultBadgeStyle(label: string): ComponentProps<typeof Badge>["variant"] {
  return "outline";

  // TODO: styling for each tag type
  switch (true) {
    case label.toLowerCase() === "work":
      return "default";
    case label.toLowerCase().startsWith("category_"):
      return "outline";
    default:
      return "secondary";
  }
}
