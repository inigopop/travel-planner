"use client"

import type React from "react"

import { useState } from "react"
import { X, Upload, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TripFormProps {
  onSubmit: (trip: {
    name: string
    destination: string
    startDate: string
    endDate: string
    status: "upcoming" | "active" | "completed"
    coverImage?: string
  }) => void
  onClose: () => void
}

export default function TripForm({ onSubmit, onClose }: TripFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    status: "upcoming" as "upcoming" | "active" | "completed",
    coverImage: "",
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setFormData({ ...formData, coverImage: imageUrl })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-pink-500 to-violet-600 text-white rounded-t-lg">
          <CardTitle>Nuevo Viaje</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Imagen de portada */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Imagen de Portada</Label>
              <div className="mt-2">
                {formData.coverImage ? (
                  <div className="relative">
                    <img
                      src={formData.coverImage || "/placeholder.svg"}
                      alt="Portada del viaje"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setFormData({ ...formData, coverImage: "" })}
                      className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Añade una imagen de portada</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="cover-image"
                    />
                    <Button asChild type="button" variant="outline" size="sm">
                      <label htmlFor="cover-image" className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-1" />
                        Subir imagen
                      </label>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="name">Nombre del Viaje</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ej. Viaje a París"
                required
              />
            </div>

            <div>
              <Label htmlFor="destination">Destino</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="ej. París, Francia"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Fecha de Inicio</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">Fecha de Fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "upcoming" | "active" | "completed") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Próximo</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-6 pb-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-pink-500 to-violet-600">
                Crear Viaje
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
