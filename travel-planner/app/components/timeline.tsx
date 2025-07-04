"use client"

import type React from "react"

import { Calendar, Clock, Plane, Building2, MapPin, Navigation } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Trip {
  id: string
  name: string
  destination: string
  startDate: string
  endDate: string
  status: "upcoming" | "active" | "completed"
  flights: Flight[]
  hotels: Hotel[]
  activities: Activity[]
}

interface Flight {
  id: string
  airline: string
  flightNumber: string
  departure: {
    airport: string
    time: string
    date: string
  }
  arrival: {
    airport: string
    time: string
    date: string
  }
  notes?: string
  attachments: any[]
}

interface Hotel {
  id: string
  name: string
  address: string
  checkIn: string
  checkOut: string
  confirmationNumber: string
  roomType?: string
  notes?: string
  attachments: any[]
}

interface Activity {
  id: string
  name: string
  location: string
  date: string
  time: string
  notes?: string
  attachments: any[]
}

interface TimelineProps {
  trip: Trip
}

interface TimelineEvent {
  id: string
  type: "flight-departure" | "flight-arrival" | "hotel-checkin" | "hotel-checkout" | "activity"
  date: string
  time: string
  title: string
  subtitle: string
  details?: string
  icon: React.ReactNode
  color: string
}

export default function Timeline({ trip }: TimelineProps) {
  const events: TimelineEvent[] = []

  // Añadir vuelos
  trip.flights.forEach((flight) => {
    events.push({
      id: `flight-dep-${flight.id}`,
      type: "flight-departure",
      date: flight.departure.date,
      time: flight.departure.time,
      title: `Salida - ${flight.airline} ${flight.flightNumber}`,
      subtitle: flight.departure.airport,
      details: flight.notes,
      icon: <Plane className="w-4 h-4" />,
      color: "bg-blue-500",
    })

    events.push({
      id: `flight-arr-${flight.id}`,
      type: "flight-arrival",
      date: flight.arrival.date,
      time: flight.arrival.time,
      title: `Llegada - ${flight.airline} ${flight.flightNumber}`,
      subtitle: flight.arrival.airport,
      details: flight.notes,
      icon: <Navigation className="w-4 h-4" />,
      color: "bg-green-500",
    })
  })

  // Añadir hoteles
  trip.hotels.forEach((hotel) => {
    events.push({
      id: `hotel-in-${hotel.id}`,
      type: "hotel-checkin",
      date: hotel.checkIn,
      time: "15:00", // Hora estándar de check-in
      title: `Check-in - ${hotel.name}`,
      subtitle: hotel.address,
      details: hotel.notes,
      icon: <Building2 className="w-4 h-4" />,
      color: "bg-purple-500",
    })

    events.push({
      id: `hotel-out-${hotel.id}`,
      type: "hotel-checkout",
      date: hotel.checkOut,
      time: "11:00", // Hora estándar de check-out
      title: `Check-out - ${hotel.name}`,
      subtitle: hotel.address,
      details: hotel.notes,
      icon: <Building2 className="w-4 h-4" />,
      color: "bg-red-500",
    })
  })

  // Añadir actividades
  trip.activities.forEach((activity) => {
    events.push({
      id: `activity-${activity.id}`,
      type: "activity",
      date: activity.date,
      time: activity.time,
      title: activity.name,
      subtitle: activity.location,
      details: activity.notes,
      icon: <MapPin className="w-4 h-4" />,
      color: "bg-orange-500",
    })
  })

  // Ordenar eventos por fecha y hora
  events.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateA.getTime() - dateB.getTime()
  })

  // Agrupar eventos por fecha
  const eventsByDate = events.reduce(
    (acc, event) => {
      if (!acc[event.date]) {
        acc[event.date] = []
      }
      acc[event.date].push(event)
      return acc
    },
    {} as Record<string, TimelineEvent[]>,
  )

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-0 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Cronología del Viaje
        </CardTitle>
      </CardHeader>
      <CardContent>
        {Object.keys(eventsByDate).length === 0 ? (
          <p className="text-blue-200 text-center py-8">No hay eventos programados</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(eventsByDate).map(([date, dayEvents]) => (
              <div key={date}>
                <div className="flex items-center mb-4">
                  <Badge variant="outline" className="border-blue-300 text-blue-200 bg-white/10">
                    {new Date(date).toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Badge>
                </div>
                <div className="space-y-3 ml-4">
                  {dayEvents.map((event, index) => (
                    <div key={event.id} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`p-2 rounded-full ${event.color} text-white shadow-lg`}>{event.icon}</div>
                        {index < dayEvents.length - 1 && <div className="w-px h-8 bg-white/20 mt-2"></div>}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium">{event.title}</span>
                          <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {event.time}
                          </Badge>
                        </div>
                        <p className="text-blue-200 text-sm">{event.subtitle}</p>
                        {event.details && <p className="text-blue-300 text-xs mt-1 italic">{event.details}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
