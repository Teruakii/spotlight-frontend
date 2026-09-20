import { initials } from "@/lib/utils";

const SIZES = {
  sm: "h-7 w-7 text-[11px]",
  md: "h-8 w-8 text-xs",
  xl: "h-20 w-20 rounded-2xl text-xl",
};

export default function Avatar({ person, size = "md" }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-zinc-200 font-semibold text-zinc-600 ${SIZES[size]}`}
    >
      {initials(person)}
    </div>
  );
}
