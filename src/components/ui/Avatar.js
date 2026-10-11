import { initials } from "@/lib/utils";

const SIZES = {
  sm: "h-7 w-7 text-[11px]",
  md: "h-8 w-8 text-xs",
  xl: "h-20 w-20 rounded-2xl text-xl",
};

export default function Avatar({ person, size = "md" }) {
  if (person?.avatarUrl) {
    return (
      <img
        src={person.avatarUrl}
        alt=""
        className={`shrink-0 border-2 border-zinc-200 object-cover ${size === "xl" ? "" : "rounded-full"} ${SIZES[size]}`}
      />
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-zinc-200 font-semibold text-zinc-600 ${SIZES[size]}`}
    >
      {initials(person)}
    </div>
  );
}
