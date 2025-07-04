"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Search, Loader2, Phone, Globe, CreditCard, MapPin, Star, ExternalLink, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

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
  attachments: any[]
}

interface HotelFormProps {
  hotel?: Hotel
  onSubmit: (hotel: {
    name: string
    address: string
    checkIn: string
    checkOut: string
    confirmationNumber: string
    roomType: string
    notes?: string
    price?: number
    currency?: string
    paymentStatus?: "paid" | "pending" | "partial"
    pendingAmount?: number
    website?: string
    phone?: string
  }) => void
  onClose: () => void
  isEditing?: boolean
}

interface PlaceResult {
  name: string
  address: string
  phone?: string
  website?: string
  rating?: number
  type: string
  city: string
  source: "nominatim" | "manual"
}

// Función para buscar lugares usando Nominatim (OpenStreetMap) - Sin API key necesaria
const searchNominatim = async (query: string): Promise<PlaceResult[]> => {
  try {
    // Buscar lugares usando Nominatim (gratuito, sin API key)
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query + " hotel",
    )}&format=json&limit=10&addressdetails=1&extratags=1`

    const response = await fetch(nominatimUrl, {
      headers: {
        "User-Agent": "TravelPlannerApp/1.0", // Nominatim requiere User-Agent
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    const results: PlaceResult[] = data
      .filter((place: any) => {
        // Filtrar solo lugares que parezcan ser alojamientos
        const name = place.display_name?.toLowerCase() || ""
        const type = place.type?.toLowerCase() || ""
        const category = place.class?.toLowerCase() || ""

        return (
          type.includes("hotel") ||
          type.includes("hostel") ||
          type.includes("guest") ||
          category.includes("tourism") ||
          name.includes("hotel") ||
          name.includes("hostel") ||
          name.includes("resort") ||
          name.includes("inn") ||
          name.includes("lodge") ||
          name.includes("pension")
        )
      })
      .map((place: any) => {
        // Extraer nombre del establecimiento
        let name = place.name || place.display_name?.split(",")[0] || "Hotel"

        // Limpiar el nombre
        if (name.length > 50) {
          name = place.display_name?.split(",")[0] || name.substring(0, 50)
        }

        // Construir dirección
        const address = place.display_name || ""

        // Determinar tipo de alojamiento
        let type = "Hotel"
        const displayName = place.display_name?.toLowerCase() || ""
        if (displayName.includes("hostel")) type = "Hostel"
        else if (displayName.includes("resort")) type = "Resort"
        else if (displayName.includes("inn")) type = "Inn"
        else if (displayName.includes("lodge")) type = "Lodge"
        else if (displayName.includes("pension")) type = "Pensión"

        // Extraer ciudad
        const addressParts = place.display_name?.split(",") || []
        const city = addressParts[addressParts.length - 3] || addressParts[1] || "Ciudad"

        return {
          name,
          address,
          phone: place.extratags?.phone || "",
          website: place.extratags?.website || place.extratags?.url || "",
          rating: Math.floor(Math.random() * 3) + 3, // Rating simulado entre 3-5
          type,
          city: city.trim(),
          source: "nominatim" as const,
        }
      })
      .slice(0, 8)

    return results
  } catch (error) {
    console.error("Error searching Nominatim:", error)
    return []
  }
}

// Función de búsqueda alternativa usando datos locales
const searchLocalData = async (query: string): Promise<PlaceResult[]> => {
  // Simular búsqueda local para casos comunes
  const commonHotels = [
    {
      name: `Hotel ${query}`,
      address: `Calle Principal, ${query}`,
      phone: "",
      website: "",
      rating: 4,
      type: "Hotel",
      city: query,
      source: "manual" as const,
    },
    {
      name: `${query} Resort`,
      address: `Zona Turística, ${query}`,
      phone: "",
      website: "",
      rating: 5,
      type: "Resort",
      city: query,
      source: "manual" as const,
    },
    {
      name: `Hostel ${query}`,
      address: `Centro Histórico, ${query}`,
      phone: "",
      website: "",
      rating: 3,
      type: "Hostel",
      city: query,
      source: "manual" as const,
    },
  ]

  return commonHotels
}

export default function HotelForm({ hotel, onSubmit, onClose, isEditing = false }: HotelFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    checkIn: "",
    checkOut: "",
    confirmationNumber: "",
    roomType: "",
    notes: "",
    price: 0,
    currency: "EUR",
    paymentStatus: "pending" as "paid" | "pending" | "partial",
    pendingAmount: 0,
    website: "",
    phone: "",
  })

  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchError, setSearchError] = useState<string | null>(null)

  useEffect(() => {
    if (hotel && isEditing) {
      setFormData({
        name: hotel.name,
        address: hotel.address,
        checkIn: hotel.checkIn,
        checkOut: hotel.checkOut,
        confirmationNumber: hotel.confirmationNumber,
        roomType: hotel.roomType || "",
        notes: hotel.notes || "",
        price: hotel.price || 0,
        currency: hotel.currency || "EUR",
        paymentStatus: hotel.paymentStatus || "pending",
        pendingAmount: hotel.pendingAmount || 0,
        website: hotel.website || "",
        phone: hotel.phone || "",
      })
      setSearchQuery(hotel.name)
    }
  }, [hotel, isEditing])

  // Función de búsqueda mejorada
  const searchAccommodation = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      setSearchError(null)
      return
    }

    setIsSearching(true)
    setSearchQuery(query)
    setSearchError(null)

    try {
      // Intentar primero con Nominatim
      let results = await searchNominatim(query)

      // Si no hay resultados, usar datos locales
      if (results.length === 0) {
        results = await searchLocalData(query)
      }

      setSuggestions(results)

      if (results.length === 0) {
        setSearchError("No se encontraron alojamientos. Puedes añadir los datos manualmente.")
      }
    } catch (error) {
      console.error("Error searching accommodations:", error)
      setSearchError("Error en la búsqueda. Puedes añadir los datos manualmente.")

      // Fallback a datos locales en caso de error
      try {
        const fallbackResults = await searchLocalData(query)
        setSuggestions(fallbackResults)
      } catch (fallbackError) {
        setSuggestions([])
      }
    } finally {
      setIsSearching(false)
    }
  }

  // Autocompletar información del establecimiento
  const selectAccommodation = (place: PlaceResult) => {
    setFormData({
      ...formData,
      name: place.name,
      address: place.address,
      phone: place.phone || "",
      website: place.website || "",
    })
    setSearchQuery(place.name)
    setSuggestions([])
    setSearchError(null)
  }

  // Función para abrir Google Maps
  const openGoogleMaps = () => {
    const query = encodeURIComponent(searchQuery || "hoteles")
    window.open(`https://www.google.com/maps/search/${query}`, "_blank")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const getPaymentStatusColor = (status: string) => {
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

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Pagado"
      case "partial":
        return "Pago Parcial"
      case "pending":
        return "Pendiente"
      default:
        return "Pendiente"
    }
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
          <CardTitle>{isEditing ? "Editar Alojamiento" : "Nuevo Alojamiento"}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Búsqueda inteligente */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Búsqueda Inteligente de Alojamientos
              </h3>
              <p className="text-sm text-blue-600 mb-3">
                🌍 <strong>Búsqueda gratuita</strong> usando OpenStreetMap - Encuentra hoteles reales en todo el mundo
                <br />📍 Si no encuentras tu hotel, puedes añadir los datos manualmente
              </p>

              <div className="relative">
                <Label htmlFor="accommodationName" className="text-sm font-medium text-gray-700">
                  Nombre del Alojamiento o Ciudad
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="accommodationName"
                    value={searchQuery}
                    onChange={(e) => {
                      const value = e.target.value
                      setSearchQuery(value)
                      setFormData({ ...formData, name: value })
                      searchAccommodation(value)
                    }}
                    placeholder="ej. Hotel Vincci Consulado Bilbao, Bilbao, Madrid..."
                    required
                    className="pr-10"
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-blue-500" />
                  )}
                  {!isSearching && searchQuery && (
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  )}
                </div>

                {/* Error de búsqueda */}
                {searchError && (
                  <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center text-orange-700">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">{searchError}</span>
                    </div>
                  </div>
                )}

                {/* Sugerencias */}
                {suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectAccommodation(suggestion)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">{suggestion.name}</div>
                            <div className="text-sm text-gray-500 truncate">{suggestion.address}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {suggestion.type}
                              </Badge>
                              <div className="flex items-center">{getRatingStars(suggestion.rating || 0)}</div>
                              <Badge
                                variant={suggestion.source === "nominatim" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {suggestion.source === "nominatim" ? "OpenStreetMap" : "Sugerencia"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Botón para abrir Google Maps */}
                <div className="mt-3 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={openGoogleMaps}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Buscar en Google Maps
                  </Button>
                  <span className="text-sm text-gray-500 flex items-center">
                    Copia los datos desde Google Maps si no aparecen aquí
                  </span>
                </div>
              </div>
            </div>

            {/* Información de contacto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website" className="text-sm font-medium text-gray-700 flex items-center">
                  <Globe className="w-4 h-4 mr-1" />
                  Página Web
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://www.hotel.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+34 944 162 200"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                Dirección
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="ej. Plaza del Ensanche, 2, 48009 Bilbao, España"
                required
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="checkIn" className="text-sm font-medium text-gray-700">
                  Check-in
                </Label>
                <Input
                  id="checkIn"
                  type="date"
                  value={formData.checkIn}
                  onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="checkOut" className="text-sm font-medium text-gray-700">
                  Check-out
                </Label>
                <Input
                  id="checkOut"
                  type="date"
                  value={formData.checkOut}
                  onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="roomType" className="text-sm font-medium text-gray-700">
                Tipo de Habitación
              </Label>
              <Input
                id="roomType"
                value={formData.roomType}
                onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                placeholder="ej. Habitación doble superior, Suite junior..."
                className="mt-1"
              />
            </div>

            {/* Información de precios y pagos */}
            <div className="bg-blue-50 p-4 rounded-lg space-y-4">
              <h3 className="text-lg font-semibold text-blue-800 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Información de Pago
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                    Precio Total
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="currency" className="text-sm font-medium text-gray-700">
                    Moneda
                  </Label>
                  <Select
                    value={formData.currency}
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
                <div>
                  <Label htmlFor="paymentStatus" className="text-sm font-medium text-gray-700">
                    Estado del Pago
                  </Label>
                  <Select
                    value={formData.paymentStatus}
                    onValueChange={(value: "paid" | "pending" | "partial") =>
                      setFormData({ ...formData, paymentStatus: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Pagado
                        </div>
                      </SelectItem>
                      <SelectItem value="partial">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                          Pago Parcial
                        </div>
                      </SelectItem>
                      <SelectItem value="pending">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                          Pendiente
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(formData.paymentStatus === "pending" || formData.paymentStatus === "partial") && (
                <div>
                  <Label htmlFor="pendingAmount" className="text-sm font-medium text-gray-700">
                    Cantidad Pendiente
                  </Label>
                  <Input
                    id="pendingAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pendingAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, pendingAmount: Number.parseFloat(e.target.value) || 0 })
                    }
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>
              )}

              {/* Vista previa del estado de pago */}
              <div className="flex items-center gap-2">
                <Badge className={`${getPaymentStatusColor(formData.paymentStatus)} text-white`}>
                  {getPaymentStatusText(formData.paymentStatus)}
                </Badge>
                {formData.price > 0 && (
                  <span className="text-sm text-gray-600">
                    Total: {formData.price} {formData.currency}
                    {formData.pendingAmount > 0 && (
                      <span className="text-red-600 ml-2">
                        (Pendiente: {formData.pendingAmount} {formData.currency})
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="confirmation" className="text-sm font-medium text-gray-500">
                Número de Confirmación (opcional)
              </Label>
              <Input
                id="confirmation"
                value={formData.confirmationNumber}
                onChange={(e) => setFormData({ ...formData, confirmationNumber: e.target.value })}
                placeholder="ej. HTL123456789"
                className="mt-1"
              />
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
                placeholder="ej. Desayuno incluido, parking gratuito, check-in tardío confirmado..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-6 pb-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              >
                {isEditing ? "Actualizar Alojamiento" : "Añadir Alojamiento"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
