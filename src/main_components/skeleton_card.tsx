import { Skeleton } from "@/components/ui/skeleton"

//skeleton to show when data is loading
export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl bg-secondary-100" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px] bg-secondary-100" />
        <Skeleton className="h-4 w-[200px] bg-secondary-100" />
      </div>
    </div>
  )
}
