"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Activity {
  id: string
  name: string
  location: string
  date: string
  time: string
  notes?: string
  attachments: any[]
  price?: number
  currency?: string
}

interface ActivityFormProps {
  activity?: Activity
  onSubmit: (activity: {
    name: string
    location: string
    date: string
    time: string
    notes?: string
    price?: number
    currency?: string
  }) => void
  onClose: () => void
  isEditing?: boolean
}

export default function ActivityForm({ activity, onSubmit, onClose, isEditing = false }: ActivityFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    date: "",
    time: "",
    notes: "",
    price: undefined as number | undefined,
    currency: "EUR",
  })

  useEffect(() => {
    if (activity && isEditing) {
      setFormData({
        name: activity.name,
        location: activity.location,
        date: activity.date,
        time: activity.time,
        notes: activity.notes || "",
        price: activity.price,
        currency: activity.currency || "EUR",
      })
    }
  }, [activity, isEditing])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
          <CardTitle>{isEditing ? "Editar Actividad" : "Nueva Actividad"}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="activityName" className="text-sm font-medium text-gray-700">
                Nombre de la Actividad
              </Label>
              <Input
                id="activityName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ej. Visita al Museo del Louvre"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                Ubicación
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="ej. Rue de Rivoli, 75001 París, Francia"
                required
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                  Fecha
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="time" className="text-sm font-medium text-gray-700">
                  Hora
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Notas
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="ej. Entrada reservada, llevar identificación, punto de encuentro..."
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                    Precio
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
                className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
              >
                {isEditing ? "Actualizar Actividad" : "Añadir Actividad"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
