"use client"

import { useState } from "react"
import {
  Plus,
  MapPin,
  Calendar,
  Plane,
  Building2,
  FileText,
  Map,
  Trash2,
  MoreVertical,
  Compass,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import TripForm from "./components/trip-form"
import TripDetails from "./components/trip-details"
import { useLocalStorage } from "./hooks/useLocalStorage"

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
  attachments: Attachment[]
}

interface Activity {
  id: string
  name: string
  location: string
  date: string
  time: string
  notes?: string
  attachments: Attachment[]
}

interface Attachment {
  id: string
  name: string
  type: "pdf" | "image" | "note"
  url?: string
  content?: string
}

// Datos iniciales de ejemplo
const initialTrips: Trip[] = [
  {
    id: "1",
    name: "Aventura en Japón",
    destination: "Tokio, Japón",
    startDate: "2024-03-15",
    endDate: "2024-03-25",
    status: "upcoming",
    coverImage: "/placeholder.svg?height=200&width=400",
    flights: [
      {
        id: "f1",
        airline: "Japan Airlines",
        flightNumber: "JL414",
        departure: {
          airport: "MAD - Madrid Barajas",
          time: "14:30",
          date: "2024-03-15",
        },
        arrival: {
          airport: "NRT - Narita International",
          time: "09:45+1",
          date: "2024-03-16",
        },
        notes: "Asiento 12A, comida vegetariana solicitada",
        attachments: [{ id: "a1", name: "Boarding Pass.pdf", type: "pdf" }],
      },
    ],
    hotels: [
      {
        id: "h1",
        name: "Hotel Gracery Shinjuku",
        address: "1-19-1 Kabukicho, Shinjuku, Tokio",
        checkIn: "2024-03-16",
        checkOut: "2024-03-20",
        confirmationNumber: "HGS123456",
        roomType: "Habitación doble con vistas a Godzilla",
        notes: "Desayuno incluido, check-in tardío confirmado",
        attachments: [
          { id: "a3", name: "Confirmación.pdf", type: "pdf" },
          { id: "a4", name: "Foto del hotel", type: "image" },
        ],
      },
    ],
    activities: [],
  },
  {
    id: "2",
    name: "Escapada a París",
    destination: "París, Francia",
    startDate: "2024-02-10",
    endDate: "2024-02-15",
    status: "completed",
    coverImage: "/placeholder.svg?height=200&width=400",
    flights: [],
    hotels: [],
    activities: [],
  },
]

export default function TravelPlannerApp() {
  // Usar LocalStorage para persistir los viajes
  const [trips, setTrips] = useLocalStorage<Trip[]>("travel-planner-trips", initialTrips)
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [showTripForm, setShowTripForm] = useState(false)

  const addTrip = (tripData: Omit<Trip, "id" | "flights" | "hotels" | "activities">) => {
    const newTrip: Trip = {
      ...tripData,
      id: Date.now().toString(),
      flights: [],
      hotels: [],
      activities: [],
    }
    setTrips([...trips, newTrip])
    setShowTripForm(false)
  }

  const updateTripStatus = (tripId: string, newStatus: "upcoming" | "active" | "completed") => {
    setTrips(trips.map((trip) => (trip.id === tripId ? { ...trip, status: newStatus } : trip)))
  }

  const deleteTrip = (tripId: string) => {
    setTrips(trips.filter((trip) => trip.id !== tripId))
  }

  const updateTrip = (updatedTrip: Trip) => {
    setTrips(trips.map((trip) => (trip.id === updatedTrip.id ? updatedTrip : trip)))
    if (selectedTrip?.id === updatedTrip.id) {
      setSelectedTrip(updatedTrip)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "from-blue-500 to-cyan-500"
      case "active":
        return "from-green-500 to-emerald-500"
      case "completed":
        return "from-gray-400 to-gray-600"
      default:
        return "from-blue-500 to-cyan-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Próximo"
      case "active":
        return "En Curso"
      case "completed":
        return "Completado"
      default:
        return "Próximo"
    }
  }

  if (selectedTrip) {
    return <TripDetails trip={selectedTrip} onBack={() => setSelectedTrip(null)} onUpdateTrip={updateTrip} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8 px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4 md:mb-6 shadow-2xl">
            <Compass className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Mis Aventuras
          </h1>
          <p className="text-lg md:text-xl text-blue-200 mb-6 md:mb-8">Organiza y vive tus mejores experiencias</p>
          <Button
            onClick={() => setShowTripForm(true)}
            className="bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-full text-base md:text-lg font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <Plus className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
            <span className="hidden sm:inline">Crear Nueva </span>Aventura
          </Button>
        </div>

        {/* Stats Cards - Rediseñadas para móvil */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 px-2">
          <Card className="bg-white/10 backdrop-blur-lg border-0 shadow-2xl hover:bg-white/20 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl shadow-lg mb-2">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-white mb-1">
                  {trips.filter((t) => t.status === "upcoming").length}
                </p>
                <p className="text-xs font-medium text-blue-200 leading-tight">Próximos Viajes</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-0 shadow-2xl hover:bg-white/20 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg mb-2">
                  <Plane className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-white mb-1">
                  {trips.reduce((acc, trip) => acc + trip.flights.length, 0)}
                </p>
                <p className="text-xs font-medium text-green-200 leading-tight">Vuelos</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-0 shadow-2xl hover:bg-white/20 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl shadow-lg mb-2">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-white mb-1">
                  {trips.reduce((acc, trip) => acc + trip.hotels.length, 0)}
                </p>
                <p className="text-xs font-medium text-purple-200 leading-tight">Hoteles</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-0 shadow-2xl hover:bg-white/20 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl shadow-lg mb-2">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-white mb-1">{new Set(trips.map((t) => t.destination)).size}</p>
                <p className="text-xs font-medium text-orange-200 leading-tight">Destinos</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 px-2">
          {trips.map((trip) => (
            <Card
              key={trip.id}
              className="bg-white/10 backdrop-blur-lg border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:bg-white/20 overflow-hidden group"
            >
              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={trip.coverImage || "/placeholder.svg?height=200&width=400"}
                  alt={trip.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const imageUrl = URL.createObjectURL(file)
                        const updatedTrip = { ...trip, coverImage: imageUrl }
                        updateTrip(updatedTrip)
                      }
                    }}
                    className="hidden"
                    id={`cover-image-${trip.id}`}
                  />
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
                  >
                    <label htmlFor={`cover-image-${trip.id}`} className="cursor-pointer">
                      <ImageIcon className="w-4 h-4 text-white" />
                    </label>
                  </Button>
                </div>
                <div className="absolute top-4 right-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                        <MoreVertical className="w-4 h-4 text-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-sm">
                      <DropdownMenuItem onClick={() => updateTripStatus(trip.id, "upcoming")}>
                        Marcar como Próximo
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateTripStatus(trip.id, "active")}>
                        Marcar como En Curso
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateTripStatus(trip.id, "completed")}>
                        Marcar como Completado
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteTrip(trip.id)} className="text-red-600 focus:text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar Viaje
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="absolute bottom-4 left-4">
                  <Badge className={`bg-gradient-to-r ${getStatusColor(trip.status)} text-white border-0 shadow-lg`}>
                    {getStatusText(trip.status)}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">
                  {trip.name}
                </CardTitle>
                <CardDescription className="flex items-center text-blue-200">
                  <MapPin className="w-4 h-4 mr-2" />
                  {trip.destination}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-blue-200">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(trip.startDate).toLocaleDateString("es-ES")} -{" "}
                    {new Date(trip.endDate).toLocaleDateString("es-ES")}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-blue-200">
                      <Plane className="w-4 h-4 mr-2" />
                      {trip.flights.length} vuelos
                    </div>
                    <div className="flex items-center text-blue-200">
                      <Building2 className="w-4 h-4 mr-2" />
                      {trip.hotels.length} hoteles
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm text-xs md:text-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(
                          `https://www.google.com/maps/search/${encodeURIComponent(trip.destination)}`,
                          "_blank",
                        )
                      }}
                    >
                      <Map className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      Maps
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm text-xs md:text-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedTrip(trip)
                      }}
                    >
                      <FileText className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      Ver
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add Trip Card */}
          <Card
            className="bg-white/5 backdrop-blur-lg border-2 border-dashed border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:bg-white/10 flex items-center justify-center min-h-[400px] group"
            onClick={() => setShowTripForm(true)}
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Nueva Aventura</h3>
              <p className="text-blue-200">Planifica tu próximo viaje</p>
            </div>
          </Card>
        </div>

        {/* Trip Form Modal */}
        {showTripForm && <TripForm onSubmit={addTrip} onClose={() => setShowTripForm(false)} />}
      </div>
    </div>
  )
}
