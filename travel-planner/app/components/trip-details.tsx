"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Plus,
  Plane,
  Building2,
  MapPin,
  Calendar,
  Clock,
  Paperclip,
  FileText,
  ImageIcon,
  Map,
  Navigation,
  Edit,
  Trash2,
  Upload,
  Download,
  Eye,
  Phone,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import FlightForm from "./flight-form"
import HotelForm from "./hotel-form"
import FileUpload from "./file-upload"
import ActivityForm from "./activity-form"
import Timeline from "./timeline"
import ExpensesSummary from "./expenses-summary"

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
  coverImage?: string
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
  price?: number
  currency?: string
  attachments: Attachment[]
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
  price?: number
  currency?: string
  paymentStatus?: "paid" | "pending" | "partial"
  pendingAmount?: number
  website?: string
  phone?: string
  attachments: Attachment[]
}

interface Activity {
  id: string
  name: string
  location: string
  date: string
  time: string
  notes?: string
  price?: number
  currency?: string
  attachments: Attachment[]
}

interface Attachment {
  id: string
  name: string
  type: "pdf" | "image" | "note"
  url?: string
  content?: string
}

interface TripDetailsProps {
  trip: Trip
  onBack: () => void
  onUpdateTrip: (trip: Trip) => void
}

export default function TripDetails({ trip, onBack, onUpdateTrip }: TripDetailsProps) {
  const [showFlightForm, setShowFlightForm] = useState(false)
  const [showHotelForm, setShowHotelForm] = useState(false)
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null)
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null)
  const [showFileUpload, setShowFileUpload] = useState<{ type: "flight" | "hotel"; id: string } | null>(null)
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)

  const addFlight = (flightData: Omit<Flight, "id" | "attachments">) => {
    const newFlight: Flight = {
      ...flightData,
      id: Date.now().toString(),
      attachments: [],
    }

    const updatedTrip = {
      ...trip,
      flights: [...trip.flights, newFlight],
    }

    onUpdateTrip(updatedTrip)
    setShowFlightForm(false)
  }

  const updateFlight = (flightData: Omit<Flight, "id" | "attachments">) => {
    if (!editingFlight) return

    const updatedFlight = {
      ...editingFlight,
      ...flightData,
    }

    const updatedTrip = {
      ...trip,
      flights: trip.flights.map((f) => (f.id === editingFlight.id ? updatedFlight : f)),
    }

    onUpdateTrip(updatedTrip)
    setEditingFlight(null)
  }

  const deleteFlight = (flightId: string) => {
    const updatedTrip = {
      ...trip,
      flights: trip.flights.filter((f) => f.id !== flightId),
    }
    onUpdateTrip(updatedTrip)
  }

  const addHotel = (hotelData: Omit<Hotel, "id" | "attachments">) => {
    const newHotel: Hotel = {
      ...hotelData,
      id: Date.now().toString(),
      attachments: [],
    }

    const updatedTrip = {
      ...trip,
      hotels: [...trip.hotels, newHotel],
    }

    onUpdateTrip(updatedTrip)
    setShowHotelForm(false)
  }

  const updateHotel = (hotelData: Omit<Hotel, "id" | "attachments">) => {
    if (!editingHotel) return

    const updatedHotel = {
      ...editingHotel,
      ...hotelData,
    }

    const updatedTrip = {
      ...trip,
      hotels: trip.hotels.map((h) => (h.id === editingHotel.id ? updatedHotel : h)),
    }

    onUpdateTrip(updatedTrip)
    setEditingHotel(null)
  }

  const deleteHotel = (hotelId: string) => {
    const updatedTrip = {
      ...trip,
      hotels: trip.hotels.filter((h) => h.id !== hotelId),
    }
    onUpdateTrip(updatedTrip)
  }

  const addActivity = (activityData: Omit<Activity, "id" | "attachments">) => {
    const newActivity: Activity = {
      ...activityData,
      id: Date.now().toString(),
      attachments: [],
    }

    const updatedTrip = {
      ...trip,
      activities: [...trip.activities, newActivity],
    }

    onUpdateTrip(updatedTrip)
    setShowActivityForm(false)
  }

  const updateActivity = (activityData: Omit<Activity, "id" | "attachments">) => {
    if (!editingActivity) return

    const updatedActivity = {
      ...editingActivity,
      ...activityData,
    }

    const updatedTrip = {
      ...trip,
      activities: trip.activities.map((a) => (a.id === editingActivity.id ? updatedActivity : a)),
    }

    onUpdateTrip(updatedTrip)
    setEditingActivity(null)
  }

  const deleteActivity = (activityId: string) => {
    const updatedTrip = {
      ...trip,
      activities: trip.activities.filter((a) => a.id !== activityId),
    }
    onUpdateTrip(updatedTrip)
  }

  const addAttachment = (type: "flight" | "hotel" | "activity", id: string, files: File[]) => {
    const newAttachments: Attachment[] = files.map((file) => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      type: file.type.startsWith("image/") ? "image" : "pdf",
      url: URL.createObjectURL(file),
    }))

    if (type === "flight") {
      const updatedTrip = {
        ...trip,
        flights: trip.flights.map((f) =>
          f.id === id ? { ...f, attachments: [...f.attachments, ...newAttachments] } : f,
        ),
      }
      onUpdateTrip(updatedTrip)
    } else if (type === "hotel") {
      const updatedTrip = {
        ...trip,
        hotels: trip.hotels.map((h) =>
          h.id === id ? { ...h, attachments: [...h.attachments, ...newAttachments] } : h,
        ),
      }
      onUpdateTrip(updatedTrip)
    } else {
      const updatedTrip = {
        ...trip,
        activities: trip.activities.map((a) =>
          a.id === id ? { ...a, attachments: [...a.attachments, ...newAttachments] } : a,
        ),
      }
      onUpdateTrip(updatedTrip)
    }

    setShowFileUpload(null)
  }

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-4 h-4" />
      case "image":
        return <ImageIcon className="w-4 h-4" />
      case "note":
        return <FileText className="w-4 h-4" />
      default:
        return <Paperclip className="w-4 h-4" />
    }
  }

  const openGoogleMaps = () => {
    const query = encodeURIComponent(trip.destination)
    window.open(`https://www.google.com/maps/search/${query}`, "_blank")
  }

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500"
      case "partial":
        return "bg-yellow-500"
      case "pending":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPaymentStatusText = (status?: string) => {
    switch (status) {
      case "paid":
        return "Pagado"
      case "partial":
        return "Pago Parcial"
      case "pending":
        return "Pendiente"
      default:
        return "Sin especificar"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-6">
        {/* Header - Rediseñado para móvil */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="p-3 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-4xl font-bold text-white bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent truncate">
                {trip.name}
              </h1>
              <div className="flex items-center gap-2 text-blue-200 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{trip.destination}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <Badge
              className={`bg-gradient-to-r ${
                trip.status === "upcoming"
                  ? "from-blue-500 to-cyan-500"
                  : trip.status === "active"
                    ? "from-green-500 to-emerald-500"
                    : "from-gray-400 to-gray-600"
              } text-white border-0 shadow-lg`}
            >
              {trip.status === "upcoming" ? "Próximo" : trip.status === "active" ? "En Curso" : "Completado"}
            </Badge>
            <div className="flex items-center text-blue-200 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              <span className="text-xs">
                {new Date(trip.startDate).toLocaleDateString("es-ES")} -{" "}
                {new Date(trip.endDate).toLocaleDateString("es-ES")}
              </span>
            </div>
          </div>
        </div>

        {/* Content Tabs - Completamente rediseñado */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/10 backdrop-blur-lg border-0 h-auto p-1">
            <TabsTrigger
              value="overview"
              className="text-white data-[state=active]:bg-white/20 flex flex-col items-center py-2 px-1 text-xs"
            >
              <span className="text-lg mb-1">📊</span>
              <span className="leading-none">Resumen</span>
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="text-white data-[state=active]:bg-white/20 flex flex-col items-center py-2 px-1 text-xs"
            >
              <span className="text-lg mb-1">⏰</span>
              <span className="leading-none">Tiempo</span>
            </TabsTrigger>
            <TabsTrigger
              value="flights"
              className="text-white data-[state=active]:bg-white/20 flex flex-col items-center py-2 px-1 text-xs"
            >
              <span className="text-lg mb-1">✈️</span>
              <span className="leading-none">Vuelos</span>
              <span className="text-xs opacity-75">({trip.flights.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="hotels"
              className="text-white data-[state=active]:bg-white/20 flex flex-col items-center py-2 px-1 text-xs"
            >
              <span className="text-lg mb-1">🏨</span>
              <span className="leading-none">Hoteles</span>
              <span className="text-xs opacity-75">({trip.hotels.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="activities"
              className="text-white data-[state=active]:bg-white/20 flex flex-col items-center py-2 px-1 text-xs"
            >
              <span className="text-lg mb-1">🎯</span>
              <span className="leading-none">Actividad</span>
              <span className="text-xs opacity-75">({trip.activities.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="expenses"
              className="text-white data-[state=active]:bg-white/20 flex flex-col items-center py-2 px-1 text-xs"
            >
              <span className="text-lg mb-1">💰</span>
              <span className="leading-none">Gastos</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <Card className="bg-white/10 backdrop-blur-lg border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Estadísticas del Viaje</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Plane className="w-5 h-5 mr-3 text-blue-400" />
                      <span className="text-blue-200">Vuelos</span>
                    </div>
                    <span className="font-semibold text-white text-xl">{trip.flights.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Building2 className="w-5 h-5 mr-3 text-purple-400" />
                      <span className="text-blue-200">Hoteles</span>
                    </div>
                    <span className="font-semibold text-white text-xl">{trip.hotels.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-3 text-green-400" />
                      <span className="text-blue-200">Actividades</span>
                    </div>
                    <span className="font-semibold text-white text-xl">{trip.activities.length}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Flights */}
              <Card className="bg-white/10 backdrop-blur-lg border-0 shadow-2xl lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Próximos Vuelos</CardTitle>
                </CardHeader>
                <CardContent>
                  {trip.flights.length > 0 ? (
                    <div className="space-y-4">
                      {trip.flights.slice(0, 2).map((flight) => (
                        <div key={flight.id} className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold text-white">
                              {flight.airline} {flight.flightNumber}
                            </div>
                            <Badge variant="outline" className="border-blue-300 text-blue-200">
                              {flight.departure.date}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm text-blue-200">
                            <div>
                              <div className="font-medium">{flight.departure.airport}</div>
                              <div>{flight.departure.time}</div>
                            </div>
                            <Navigation className="w-4 h-4" />
                            <div className="text-right">
                              <div className="font-medium">{flight.arrival.airport}</div>
                              <div>{flight.arrival.time}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-blue-200 text-center py-8">No hay vuelos añadidos</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Google Maps Button - Movido abajo */}
            <div className="flex justify-center pt-6">
              <Button
                onClick={openGoogleMaps}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-full shadow-lg w-full max-w-sm"
              >
                <Map className="w-5 h-5 mr-2" />
                Ver {trip.destination} en Google Maps
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Timeline trip={trip} />

            {/* Google Maps Button */}
            <div className="flex justify-center pt-6">
              <Button
                onClick={openGoogleMaps}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-full shadow-lg w-full max-w-sm"
              >
                <Map className="w-5 h-5 mr-2" />
                Ver en Google Maps
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="flights" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Vuelos</h2>
              <Button
                onClick={() => setShowFlightForm(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 px-4 py-2 rounded-full shadow-lg"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Añadir </span>Vuelo
              </Button>
            </div>

            <div className="grid gap-6">
              {trip.flights.map((flight) => (
                <Card key={flight.id} className="bg-white/10 backdrop-blur-lg border-0 shadow-2xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg md:text-xl text-white truncate">
                        {flight.airline} {flight.flightNumber}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-blue-300 text-blue-200 text-xs">
                          {flight.departure.date}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingFlight(flight)}
                          className="text-blue-200 hover:text-white hover:bg-white/20 h-8 w-8"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteFlight(flight.id)}
                          className="text-red-300 hover:text-red-200 hover:bg-red-500/20 h-8 w-8"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-3 bg-green-500/20 rounded-xl">
                        <h4 className="font-semibold text-green-300 mb-2 text-sm">Salida</h4>
                        <div className="space-y-1">
                          <div className="font-medium text-white text-sm">{flight.departure.airport}</div>
                          <div className="text-xs text-green-200 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(flight.departure.date).toLocaleDateString("es-ES")}
                            <Clock className="w-3 h-3 ml-2 mr-1" />
                            {flight.departure.time}
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-red-500/20 rounded-xl">
                        <h4 className="font-semibold text-red-300 mb-2 text-sm">Llegada</h4>
                        <div className="space-y-1">
                          <div className="font-medium text-white text-sm">{flight.arrival.airport}</div>
                          <div className="text-xs text-red-200 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(flight.arrival.date).toLocaleDateString("es-ES")}
                            <Clock className="w-3 h-3 ml-2 mr-1" />
                            {flight.arrival.time}
                          </div>
                        </div>
                      </div>
                    </div>

                    {flight.notes && (
                      <div className="p-3 bg-white/10 rounded-xl">
                        <h4 className="font-semibold text-white mb-2 text-sm">Notas</h4>
                        <p className="text-blue-200 text-xs">{flight.notes}</p>
                      </div>
                    )}

                    {/* Información de precio */}
                    {flight.price && flight.price > 0 && (
                      <div className="p-3 bg-green-500/20 rounded-xl">
                        <h4 className="font-semibold text-green-300 mb-2 text-sm">Precio</h4>
                        <div className="text-white font-medium text-sm">
                          {flight.price} {flight.currency || "EUR"}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-wrap gap-2">
                        {flight.attachments.map((attachment) => (
                          <Dialog key={attachment.id}>
                            <DialogTrigger asChild>
                              <Badge
                                variant="secondary"
                                className="flex items-center gap-1 bg-white/20 text-white cursor-pointer hover:bg-white/30 text-xs"
                              >
                                {getAttachmentIcon(attachment.type)}
                                <span className="truncate max-w-20">{attachment.name}</span>
                                <Eye className="w-3 h-3" />
                              </Badge>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>{attachment.name}</DialogTitle>
                              </DialogHeader>
                              {attachment.type === "image" && attachment.url && (
                                <img
                                  src={attachment.url || "/placeholder.svg"}
                                  alt={attachment.name}
                                  className="w-full h-auto rounded-lg"
                                />
                              )}
                              {attachment.type === "pdf" && attachment.url && (
                                <div className="space-y-4">
                                  <iframe
                                    src={attachment.url}
                                    className="w-full h-96 rounded-lg border"
                                    title={attachment.name}
                                  />
                                  <Button asChild className="w-full">
                                    <a href={attachment.url} download={attachment.name}>
                                      <Download className="w-4 h-4 mr-2" />
                                      Descargar PDF
                                    </a>
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowFileUpload({ type: "flight", id: flight.id })}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex-1 text-xs"
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          Adjuntar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `https://www.google.com/maps/search/${encodeURIComponent(flight.arrival.airport)}`,
                              "_blank",
                            )
                          }
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex-1 text-xs"
                        >
                          <Map className="w-3 h-3 mr-1" />
                          Ver en mapa
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {trip.flights.length === 0 && (
                <Card className="bg-white/10 backdrop-blur-lg border-0 shadow-2xl">
                  <CardContent className="text-center py-12">
                    <Plane className="w-16 h-16 mx-auto text-blue-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No hay vuelos añadidos</h3>
                    <p className="text-blue-200 mb-4">Añade tu primer vuelo para comenzar a organizar tu viaje</p>
                    <Button
                      onClick={() => setShowFlightForm(true)}
                      className="bg-gradient-to-r from-blue-500 to-cyan-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Añadir Vuelo
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="hotels" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Hoteles</h2>
              <Button
                onClick={() => setShowHotelForm(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 px-4 py-2 rounded-full shadow-lg"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Añadir </span>Hotel
              </Button>
            </div>

            <div className="grid gap-6">
              {trip.hotels.map((hotel) => (
                <Card key={hotel.id} className="bg-white/10 backdrop-blur-lg border-0 shadow-2xl">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg md:text-xl text-white truncate">{hotel.name}</CardTitle>
                        <CardDescription className="flex items-start text-blue-200 mt-1 text-sm">
                          <MapPin className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{hotel.address}</span>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingHotel(hotel)}
                          className="text-blue-200 hover:text-white hover:bg-white/20 h-8 w-8"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteHotel(hotel.id)}
                          className="text-red-300 hover:text-red-200 hover:bg-red-500/20 h-8 w-8"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="p-3 bg-green-500/20 rounded-xl">
                        <h4 className="font-semibold text-green-300 mb-1 text-sm">Check-in</h4>
                        <div className="text-white font-medium text-sm">
                          {new Date(hotel.checkIn).toLocaleDateString("es-ES")}
                        </div>
                      </div>
                      <div className="p-3 bg-red-500/20 rounded-xl">
                        <h4 className="font-semibold text-red-300 mb-1 text-sm">Check-out</h4>
                        <div className="text-white font-medium text-sm">
                          {new Date(hotel.checkOut).toLocaleDateString("es-ES")}
                        </div>
                      </div>
                      <div className="p-3 bg-blue-500/20 rounded-xl">
                        <h4 className="font-semibold text-blue-300 mb-1 text-sm">Tipo de habitación</h4>
                        <div className="text-white font-medium text-sm">{hotel.roomType || "Habitación estándar"}</div>
                      </div>
                    </div>

                    {/* Información de precio y pago */}
                    {hotel.price && hotel.price > 0 && (
                      <div className="p-3 bg-purple-500/20 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-purple-300 text-sm">Precio</h4>
                          <Badge className={`${getPaymentStatusColor(hotel.paymentStatus)} text-white text-xs`}>
                            {getPaymentStatusText(hotel.paymentStatus)}
                          </Badge>
                        </div>
                        <div className="text-white font-medium text-sm">
                          {hotel.price} {hotel.currency || "EUR"}
                          {hotel.pendingAmount && hotel.pendingAmount > 0 && (
                            <div className="text-red-300 text-xs mt-1">
                              Pendiente: {hotel.pendingAmount} {hotel.currency || "EUR"}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Información de contacto */}
                    {(hotel.phone || hotel.website) && (
                      <div className="p-3 bg-gray-500/20 rounded-xl">
                        <h4 className="font-semibold text-gray-300 mb-2 text-sm">Contacto</h4>
                        <div className="space-y-1">
                          {hotel.phone && (
                            <div className="text-white text-xs flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              <a href={`tel:${hotel.phone}`} className="hover:text-blue-300">
                                {hotel.phone}
                              </a>
                            </div>
                          )}
                          {hotel.website && (
                            <div className="text-white text-xs flex items-center">
                              <Globe className="w-3 h-3 mr-1" />
                              <a
                                href={hotel.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-300 truncate"
                              >
                                {hotel.website.replace(/^https?:\/\//, "")}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {hotel.notes && (
                      <div className="p-3 bg-white/10 rounded-xl">
                        <h4 className="font-semibold text-white mb-2 text-sm">Notas</h4>
                        <p className="text-blue-200 text-xs">{hotel.notes}</p>
                      </div>
                    )}

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-wrap gap-2">
                        {hotel.attachments.map((attachment) => (
                          <Dialog key={attachment.id}>
                            <DialogTrigger asChild>
                              <Badge
                                variant="secondary"
                                className="flex items-center gap-1 bg-white/20 text-white cursor-pointer hover:bg-white/30 text-xs"
                              >
                                {getAttachmentIcon(attachment.type)}
                                <span className="truncate max-w-20">{attachment.name}</span>
                                <Eye className="w-3 h-3" />
                              </Badge>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>{attachment.name}</DialogTitle>
                              </DialogHeader>
                              {attachment.type === "image" && attachment.url && (
                                <img
                                  src={attachment.url || "/placeholder.svg"}
                                  alt={attachment.name}
                                  className="w-full h-auto rounded-lg"
                                />
                              )}
                              {attachment.type === "pdf" && attachment.url && (
                                <div className="space-y-4">
                                  <iframe
                                    src={attachment.url}
                                    className="w-full h-96 rounded-lg border"
                                    title={attachment.name}
                                  />
                                  <Button asChild className="w-full">
                                    <a href={attachment.url} download={attachment.name}>
                                      <Download className="w-4 h-4 mr-2" />
                                      Descargar PDF
                                    </a>
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowFileUpload({ type: "hotel", id: hotel.id })}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex-1 text-xs"
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          Adjuntar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `https://www.google.com/maps/search/${encodeURIComponent(hotel.name + " " + hotel.address)}`,
                              "_blank",
                            )
                          }
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex-1 text-xs"
                        >
                          <Map className="w-3 h-3 mr-1" />
                          Ver hotel
                        </Button>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(
                            `https://www.google.com/maps/search/restaurantes+cerca+de+${encodeURIComponent(hotel.address)}`,
                            "_blank",
                          )
                        }
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full text-xs"
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        Restaurantes cercanos
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {trip.hotels.length === 0 && (
                <Card className="bg-white/10 backdrop-blur-lg border-0 shadow-2xl">
                  <CardContent className="text-center py-12">
                    <Building2 className="w-16 h-16 mx-auto text-purple-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No hay hoteles añadidos</h3>
                    <p className="text-blue-200 mb-4">Añade tu primer hotel para organizar tu alojamiento</p>
                    <Button
                      onClick={() => setShowHotelForm(true)}
                      className="bg-gradient-to-r from-purple-500 to-pink-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Añadir Hotel
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Actividades</h2>
              <Button
                onClick={() => setShowActivityForm(true)}
                className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 px-4 py-2 rounded-full shadow-lg"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Añadir </span>Actividad
              </Button>
            </div>

            <div className="grid gap-6">
              {trip.activities.map((activity) => (
                <Card key={activity.id} className="bg-white/10 backdrop-blur-lg border-0 shadow-2xl">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg md:text-xl text-white truncate">{activity.name}</CardTitle>
                        <CardDescription className="flex items-start text-blue-200 mt-1 text-sm">
                          <MapPin className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{activity.location}</span>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingActivity(activity)}
                          className="text-blue-200 hover:text-white hover:bg-white/20 h-8 w-8"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteActivity(activity.id)}
                          className="text-red-300 hover:text-red-200 hover:bg-red-500/20 h-8 w-8"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-green-500/20 rounded-xl">
                        <h4 className="font-semibold text-green-300 mb-1 text-sm">Fecha</h4>
                        <div className="text-white font-medium text-sm">
                          {new Date(activity.date).toLocaleDateString("es-ES")}
                        </div>
                      </div>
                      <div className="p-3 bg-blue-500/20 rounded-xl">
                        <h4 className="font-semibold text-blue-300 mb-1 text-sm">Hora</h4>
                        <div className="text-white font-medium text-sm">{activity.time}</div>
                      </div>
                    </div>

                    {activity.notes && (
                      <div className="p-3 bg-white/10 rounded-xl">
                        <h4 className="font-semibold text-white mb-2 text-sm">Notas</h4>
                        <p className="text-blue-200 text-xs">{activity.notes}</p>
                      </div>
                    )}

                    {/* Información de precio */}
                    {activity.price && activity.price > 0 && (
                      <div className="p-3 bg-green-500/20 rounded-xl">
                        <h4 className="font-semibold text-green-300 mb-2 text-sm">Precio</h4>
                        <div className="text-white font-medium text-sm">
                          {activity.price} {activity.currency || "EUR"}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-wrap gap-2">
                        {activity.attachments.map((attachment) => (
                          <Dialog key={attachment.id}>
                            <DialogTrigger asChild>
                              <Badge
                                variant="secondary"
                                className="flex items-center gap-1 bg-white/20 text-white cursor-pointer hover:bg-white/30 text-xs"
                              >
                                {getAttachmentIcon(attachment.type)}
                                <span className="truncate max-w-20">{attachment.name}</span>
                                <Eye className="w-3 h-3" />
                              </Badge>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>{attachment.name}</DialogTitle>
                              </DialogHeader>
                              {attachment.type === "image" && attachment.url && (
                                <img
                                  src={attachment.url || "/placeholder.svg"}
                                  alt={attachment.name}
                                  className="w-full h-auto rounded-lg"
                                />
                              )}
                              {attachment.type === "pdf" && attachment.url && (
                                <div className="space-y-4">
                                  <iframe
                                    src={attachment.url}
                                    className="w-full h-96 rounded-lg border"
                                    title={attachment.name}
                                  />
                                  <Button asChild className="w-full">
                                    <a href={attachment.url} download={attachment.name}>
                                      <Download className="w-4 h-4 mr-2" />
                                      Descargar PDF
                                    </a>
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowFileUpload({ type: "activity" as any, id: activity.id })}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex-1 text-xs"
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          Adjuntar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `https://www.google.com/maps/search/${encodeURIComponent(activity.location)}`,
                              "_blank",
                            )
                          }
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex-1 text-xs"
                        >
                          <Map className="w-3 h-3 mr-1" />
                          Ver en mapa
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {trip.activities.length === 0 && (
                <Card className="bg-white/10 backdrop-blur-lg border-0 shadow-2xl">
                  <CardContent className="text-center py-12">
                    <MapPin className="w-16 h-16 mx-auto text-green-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No hay actividades añadidas</h3>
                    <p className="text-blue-200 mb-4">Añade actividades para planificar tu itinerario</p>
                    <Button
                      onClick={() => setShowActivityForm(true)}
                      className="bg-gradient-to-r from-green-500 to-teal-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Añadir Actividad
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          <TabsContent value="expenses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Gastos del Viaje</h2>
            </div>

            <ExpensesSummary trip={trip} />
          </TabsContent>
        </Tabs>

        {/* Forms and Modals */}
        {showFlightForm && <FlightForm onSubmit={addFlight} onClose={() => setShowFlightForm(false)} />}

        {editingFlight && (
          <FlightForm
            flight={editingFlight}
            onSubmit={updateFlight}
            onClose={() => setEditingFlight(null)}
            isEditing={true}
          />
        )}

        {showHotelForm && <HotelForm onSubmit={addHotel} onClose={() => setShowHotelForm(false)} />}

        {editingHotel && (
          <HotelForm
            hotel={editingHotel}
            onSubmit={updateHotel}
            onClose={() => setEditingHotel(null)}
            isEditing={true}
          />
        )}

        {showFileUpload && (
          <FileUpload
            onUpload={(files) => addAttachment(showFileUpload.type, showFileUpload.id, files)}
            onClose={() => setShowFileUpload(null)}
          />
        )}

        {showActivityForm && <ActivityForm onSubmit={addActivity} onClose={() => setShowActivityForm(false)} />}

        {editingActivity && (
          <ActivityForm
            activity={editingActivity}
            onSubmit={updateActivity}
            onClose={() => setEditingActivity(null)}
            isEditing={true}
          />
        )}
      </div>
    </div>
  )
}
