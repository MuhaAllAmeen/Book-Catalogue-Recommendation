// import * as React from "react"
import { Pie, PieChart, Sector } from "recharts"
import type{ PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import type{ChartConfig} from "@/components/ui/chart"

import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  // ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {  useMemo, useState } from "react"
import type { BooksWithStatusType } from "@/pages/progress"
import type { ReadingStatus } from "@/pages/book"

export const description = "An interactive pie chart"


//pie chart that shows the status and number of books with that status
export function ChartPieInteractive({ booksWithStatus, onStatusChanged }: { booksWithStatus: BooksWithStatusType[], onStatusChanged: (status:ReadingStatus) => void }) {
  const id = "pie-interactive"


  // defines data with the status, number of books and color of pie chart slice
  const data = booksWithStatus.map((booksStatus,index)=>{
    return {status: booksStatus.status, length: booksStatus.books.length, fill:`var(--chart-${index+1})`}
  })

  const chartConfig = data.reduce((acc, value) => {
    acc[value.status] = { label: value.status, color: value.fill }
    return acc
  }, {} as Record<string, { label: string, color:string }>) satisfies ChartConfig

  // initial status is given as the first status in data
  //callback also called here so that initial status is sent to parent so that books can be displayed of the initial status when first visiting the page
  const [activeStatus, setActiveStatus] = useState(()=>{onStatusChanged(data[0].status); return data[0].status})

  //change activeIndex by finding the index of the active status
  const activeIndex = useMemo(
    () => data.findIndex((item) => item.status === activeStatus),
    [activeStatus]
  )


  const statuses = useMemo(() => data.map((item) => item.status), [booksWithStatus])


  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Your Detailed Progress</CardTitle>
          <CardDescription>Ordered by Status</CardDescription>
        </div>

        {/* callback also called here so that on status change, parent can show books of that status */}
        <Select value={activeStatus} onValueChange={(value)=>{
                setActiveStatus(value as ReadingStatus)
                onStatusChanged(value as ReadingStatus)
                }}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5 border-middle-100"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {statuses.map((key,index) => {
              const config = chartConfig[key as keyof typeof chartConfig]

              if (!config) {
                return null
              }

              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{
                        backgroundColor: `var(--chart-${index+1})`,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart width={300} height={300}>
          <ChartTooltip
              cursor={false}
              defaultIndex={activeIndex}
              active = {true}
              // content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="length"
              nameKey="status"
              cx="50%"
              cy="50%"
              innerRadius={60}
              strokeWidth={5}
            
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
            </Pie>
            {/* this label will show the number of books with that status */}
            {/* Custom centered label */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground text-3xl font-bold"
            >
              {data[activeIndex].length.toLocaleString()}
              <tspan
                x="50%"
                dy={24}
                className="fill-muted-foreground"
              >
                Books
              </tspan>
            </text>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
