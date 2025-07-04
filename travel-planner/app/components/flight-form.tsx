"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Search, Loader2, Plane, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  price?: number
  currency?: string
}

interface FlightFormProps {
  flight?: Flight
  onSubmit: (flight: {
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
  }) => void
  onClose: () => void
  isEditing?: boolean
}

// Base de datos simulada de vuelos ampliada (en producción vendría de una API de aerolíneas)
const flightDatabase = {
  // Vuelos desde España
  IB6250: {
    airline: "Iberia",
    departure: { airport: "MAD - Madrid Barajas", time: "14:30" },
    arrival: { airport: "CDG - Charles de Gaulle", time: "16:45" },
  },
  IB1626: {
    airline: "Iberia",
    departure: { airport: "MAD - Madrid Barajas", time: "08:15" },
    arrival: { airport: "CMN - Mohammed V Casablanca", time: "09:45" },
  },
  AT970: {
    airline: "Royal Air Maroc",
    departure: { airport: "CMN - Mohammed V Casablanca", time: "11:30" },
    arrival: { airport: "MAD - Madrid Barajas", time: "15:15" },
  },
  AT971: {
    airline: "Royal Air Maroc",
    departure: { airport: "MAD - Madrid Barajas", time: "16:45" },
    arrival: { airport: "CMN - Mohammed V Casablanca", time: "18:15" },
  },
  VY7822: {
    airline: "Vueling",
    departure: { airport: "BCN - Barcelona El Prat", time: "07:20" },
    arrival: { airport: "RAK - Marrakech Menara", time: "08:50" },
  },
  FR1902: {
    airline: "Ryanair",
    departure: { airport: "MAD - Madrid Barajas", time: "06:30" },
    arrival: { airport: "FEZ - Fez Saiss", time: "08:00" },
  },
  JL414: {
    airline: "Japan Airlines",
    departure: { airport: "MAD - Madrid Barajas", time: "14:30" },
    arrival: { airport: "NRT - Narita International", time: "09:45+1" },
  },
  BA456: {
    airline: "British Airways",
    departure: { airport: "LHR - London Heathrow", time: "10:15" },
    arrival: { airport: "JFK - John F. Kennedy", time: "13:30" },
  },
  LH441: {
    airline: "Lufthansa",
    departure: { airport: "FRA - Frankfurt", time: "08:20" },
    arrival: { airport: "LAX - Los Angeles", time: "11:45" },
  },
  AF1234: {
    airline: "Air France",
    departure: { airport: "CDG - Charles de Gaulle", time: "19:30" },
    arrival: { airport: "NRT - Narita International", time: "14:20+1" },
  },
  EK142: {
    airline: "Emirates",
    departure: { airport: "DXB - Dubai International", time: "03:35" },
    arrival: { airport: "MAD - Madrid Barajas", time: "08:55" },
  },
  QR150: {
    airline: "Qatar Airways",
    departure: { airport: "DOH - Hamad International", time: "02:10" },
    arrival: { airport: "BCN - Barcelona El Prat", time: "07:25" },
  },
  TK1856: {
    airline: "Turkish Airlines",
    departure: { airport: "IST - Istanbul Airport", time: "13:45" },
    arrival: { airport: "CMN - Mohammed V Casablanca", time: "17:30" },
  },
  UX045: {
    airline: "Air Europa",
    departure: { airport: "MAD - Madrid Barajas", time: "23:55" },
    arrival: { airport: "CUN - Cancún", time: "05:30+1" },
  },
}

export default function FlightForm({ flight, onSubmit, onClose, isEditing = false }: FlightFormProps) {
  const [formData, setFormData] = useState({
    airline: "",
    flightNumber: "",
    departure: {
      airport: "",
      time: "",
      date: "",
    },
    arrival: {
      airport: "",
      time: "",
      date: "",
    },
    notes: "",
    price: undefined as number | undefined,
    currency: "EUR",
  })

  const [isSearching, setIsSearching] = useState(false)
  const [flightFound, setFlightFound] = useState(false)

  useEffect(() => {
    if (flight && isEditing) {
      setFormData({
        airline: flight.airline,
        flightNumber: flight.flightNumber,
        departure: flight.departure,
        arrival: flight.arrival,
        notes: flight.notes || "",
        price: flight.price,
        currency: flight.currency || "EUR",
      })
    }
  }, [flight, isEditing])

  // Función para buscar vuelo inteligentemente
  const searchFlight = async (flightNumber: string) => {
    if (flightNumber.length < 4) {
      setFlightFound(false)
      return
    }

    setIsSearching(true)

    // Simular búsqueda en base de datos de vuelos
    await new Promise((resolve) => setTimeout(resolve, 800))

    const flightInfo = flightDatabase[flightNumber.toUpperCase() as keyof typeof flightDatabase]

    if (flightInfo) {
      setFormData({
        ...formData,
        flightNumber: flightNumber.toUpperCase(),
        airline: flightInfo.airline,
        departure: {
          ...formData.departure,
          airport: flightInfo.departure.airport,
          time: flightInfo.departure.time,
        },
        arrival: {
          ...formData.arrival,
          airport: flightInfo.arrival.airport,
          time: flightInfo.arrival.time,
        },
      })
      setFlightFound(true)
    } else {
      setFlightFound(false)
    }

    setIsSearching(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-t-lg">
          <CardTitle>{isEditing ? "Editar Vuelo" : "Nuevo Vuelo"}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Búsqueda inteligente de vuelo */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                <Plane className="w-5 h-5 mr-2" />
                Búsqueda Inteligente de Vuelo
              </h3>

              <div className="relative">
                <Label htmlFor="flightNumber" className="text-sm font-medium text-gray-700">
                  Número de Vuelo
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="flightNumber"
                    value={formData.flightNumber}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase()
                      setFormData({ ...formData, flightNumber: value })
                      searchFlight(value)
                    }}
                    placeholder="ej. IB6250, JL414, BA456"
                    required
                    className="pr-10"
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-blue-500" />
                  )}
                  {!isSearching && formData.flightNumber && (
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  )}
                </div>

                {flightFound && !isSearching && (
                  <div className="mt-2">
                    <Badge className="bg-green-500 text-white">✓ Vuelo encontrado - Información autocompletada</Badge>
                  </div>
                )}

                {!flightFound && !isSearching && formData.flightNumber.length >= 4 && (
                  <div className="mt-2">
                    <Badge variant="outline" className="border-orange-500 text-orange-600">
                      ⚠️ Vuelo no encontrado - Completa manualmente
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="airline" className="text-sm font-medium text-gray-700">
                  Aerolínea
                </Label>
                <Input
                  id="airline"
                  value={formData.airline}
                  onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                  placeholder="ej. Iberia"
                  required
                  className="mt-1"
                  disabled={flightFound}
                />
              </div>
              <div>
                <Label htmlFor="flightNumberDisplay" className="text-sm font-medium text-gray-700">
                  Número de Vuelo
                </Label>
                <Input
                  id="flightNumberDisplay"
                  value={formData.flightNumber}
                  onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value.toUpperCase() })}
                  placeholder="ej. IB6250"
                  required
                  className="mt-1"
                  disabled={flightFound}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-600 flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Salida
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50 rounded-lg">
                <div>
                  <Label htmlFor="depAirport" className="text-sm font-medium text-gray-700">
                    Aeropuerto
                  </Label>
                  <Input
                    id="depAirport"
                    value={formData.departure.airport}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        departure: { ...formData.departure, airport: e.target.value },
                      })
                    }
                    placeholder="ej. MAD - Madrid Barajas"
                    required
                    className="mt-1"
                    disabled={flightFound}
                  />
                </div>
                <div>
                  <Label htmlFor="depDate" className="text-sm font-medium text-gray-700">
                    Fecha
                  </Label>
                  <Input
                    id="depDate"
                    type="date"
                    value={formData.departure.date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        departure: { ...formData.departure, date: e.target.value },
                      })
                    }
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="depTime" className="text-sm font-medium text-gray-700">
                    Hora
                  </Label>
                  <Input
                    id="depTime"
                    type="time"
                    value={formData.departure.time}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        departure: { ...formData.departure, time: e.target.value },
                      })
                    }
                    required
                    className="mt-1"
                    disabled={flightFound}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-red-600 flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                Llegada
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-red-50 rounded-lg">
                <div>
                  <Label htmlFor="arrAirport" className="text-sm font-medium text-gray-700">
                    Aeropuerto
                  </Label>
                  <Input
                    id="arrAirport"
                    value={formData.arrival.airport}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        arrival: { ...formData.arrival, airport: e.target.value },
                      })
                    }
                    placeholder="ej. CDG - Charles de Gaulle"
                    required
                    className="mt-1"
                    disabled={flightFound}
                  />
                </div>
                <div>
                  <Label htmlFor="arrDate" className="text-sm font-medium text-gray-700">
                    Fecha
                  </Label>
                  <Input
                    id="arrDate"
                    type="date"
                    value={formData.arrival.date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        arrival: { ...formData.arrival, date: e.target.value },
                      })
                    }
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="arrTime" className="text-sm font-medium text-gray-700">
                    Hora
                  </Label>
                  <Input
                    id="arrTime"
                    type="time"
                    value={formData.arrival.time}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        arrival: { ...formData.arrival, time: e.target.value },
                      })
                    }
                    required
                    className="mt-1"
                    disabled={flightFound}
                  />
                </div>
              </div>
            </div>

            {/* Campo de notas */}
            <div>
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Notas
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="ej. Asiento 12A, comida vegetariana solicitada, equipaje facturado..."
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Información de precio */}
            <div className="bg-green-50 p-4 rounded-lg space-y-4">
              <h3 className="text-lg font-semibold text-green-800 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Información de Precio (Opcional)
              </h3>
              <p className="text-sm text-green-600">
                💡 Para vuelos de ida y vuelta, añade el precio total solo en uno de los vuelos
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                    Precio Total
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, price: Number.parseFloat(e.target.value) || undefined })
                    }
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="currency" className="text-sm font-medium text-gray-700">
                    Moneda
                  </Label>
                  <Select
                    value={formData.currency || "EUR"}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                      <SelectItem value="MAD">MAD (Dirham)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 pb-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
              >
                {isEditing ? "Actualizar Vuelo" : "Añadir Vuelo"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
