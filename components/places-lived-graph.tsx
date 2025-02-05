"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface PlaceData {
  month: number
  distance: number
  city: string
  time_of: number
}

const rawData: PlaceData[] = [
  { month: 12, distance: 0, city: "Raleigh, NC", time_of: 1987 },
  { month: 5, distance: 7523.18, city: "Ludhiana, India", time_of: 1993 },
  { month: 8, distance: 0, city: "Raleigh, NC", time_of: 1993 },
  { month: 5, distance: 610.4, city: "Boston, MA", time_of: 2005 },
  { month: 8, distance: 0, city: "Raleigh, NC", time_of: 2005 },
  { month: 8, distance: 21.7, city: "Durham, NC", time_of: 2006 },
  { month: 5, distance: 7726.22, city: "New Delhi, India", time_of: 2007 },
  { month: 8, distance: 21.7, city: "Durham, NC", time_of: 2007 },
  { month: 5, distance: 7779.19, city: "Jodhpur, India", time_of: 2008 },
  { month: 8, distance: 21.7, city: "Durham, NC", time_of: 2008 },
  { month: 1, distance: 724.04, city: "Montreal, Canada", time_of: 2009 },
  { month: 5, distance: 7967.37, city: "Ahmedabad, India", time_of: 2009 },
  { month: 8, distance: 21.7, city: "Durham, NC", time_of: 2009 },
  { month: 8, distance: 2364.49, city: "Seattle, WA", time_of: 2010 },
  { month: 9, distance: 2407.48, city: "San Francisco, CA", time_of: 2012 },
  { month: 11, distance: 2407.48, city: "San Francisco, CA", time_of: 2013 },
  { month: 8, distance: 356, city: "Atlanta, GA", time_of: 2014 },
  { month: 7, distance: 1463, city: "Denver, CO", time_of: 2019 },
  { month: 8, distance: 1463, city: "Denver, CO", time_of: 2022 },
  { month: 9, distance: 1479, city: "Boulder, CO", time_of: 2022 },
  { month: 12, distance: 1479, city: "Boulder, CO", time_of: 2024 },
]

export function PlacesLivedGraph() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove()

    // Set up dimensions
    const width = 600
    const height = 700
    const margin = { top: 20, right: 100, bottom: 30, left: 40 }

    // Create scales
    const yScale = d3
      .scaleTime()
      .domain([new Date(d3.min(rawData, (d) => d.time_of)!, 0), new Date(d3.max(rawData, (d) => d.time_of)!, 11)])
      .range([margin.top, height - margin.bottom])

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(rawData, (d) => d.distance)!])
      .range([margin.left, width - margin.right])

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;")

    // Draw horizontal lines
    svg
      .selectAll("line.horizontal")
      .data(rawData)
      .enter()
      .append("line")
      .attr("class", "horizontal")
      .attr("x1", (d, i) => {
        if (i === 0) return xScale(d.distance)
        return xScale(rawData[i - 1].distance)
      })
      .attr("y1", (d) => yScale(new Date(d.time_of, d.month - 1)))
      .attr("x2", (d) => xScale(d.distance))
      .attr("y2", (d) => yScale(new Date(d.time_of, d.month - 1)))
      .attr("stroke", "steelblue")
      .attr("stroke-width", 0.5)

    // Draw vertical lines
    svg
      .selectAll("line.vertical")
      .data(rawData)
      .enter()
      .append("line")
      .attr("class", "vertical")
      .attr("x1", (d) => xScale(d.distance))
      .attr("y1", (d) => yScale(new Date(d.time_of, d.month - 1)))
      .attr("x2", (d) => xScale(d.distance))
      .attr("y2", (d, i) => {
        if (i === rawData.length - 1) return yScale(new Date(d.time_of, d.month - 1))
        return yScale(new Date(rawData[i + 1].time_of, rawData[i + 1].month - 1))
      })
      .attr("stroke", "steelblue")
      .attr("stroke-width", 0.5)

    // Add points
    svg
      .selectAll("circle")
      .data(rawData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.distance))
      .attr("cy", (d) => yScale(new Date(d.time_of, d.month - 1)))
      .attr("r", 3)
      .attr("fill", "orange")

    // Add city labels (only for the first occurrence of each city)
    const uniqueCities = new Set<string>()
    svg
      .selectAll("text.city")
      .data(rawData)
      .enter()
      .filter((d) => {
        if (!uniqueCities.has(d.city)) {
          uniqueCities.add(d.city)
          return true
        }
        return false
      })
      .append("text")
      .attr("class", "city")
      .attr("x", (d) => xScale(d.distance) + 5)
      .attr("y", (d) => yScale(new Date(d.time_of, d.month - 1)) - 5)
      .attr("text-anchor", "start")
      .attr("font-size", "10px")
      .text((d) => d.city)

    // Add axes
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    // Add x-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .append("text")
      .attr("x", width / 2)
      .attr("y", 25)
      .attr("fill", "currentColor")
      .attr("text-anchor", "middle")
      .text("Distance")

    // Add y-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -30)
      .attr("fill", "currentColor")
      .attr("text-anchor", "middle")
      .text("Time")
  }, [])

  return (
    <div className="w-full overflow-x-auto">
      <svg ref={svgRef} className="mx-auto" />
    </div>
  )
}

