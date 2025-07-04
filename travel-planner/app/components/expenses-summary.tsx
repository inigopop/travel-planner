"use client"

import { CreditCard, Plane, Building2, MapPin, AlertCircle, TrendingUp, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

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
  price?: number
  currency?: string
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
  price?: number
  currency?: string
  paymentStatus?: "paid" | "pending" | "partial"
  pendingAmount?: number
  website?: string
  phone?: string
  attachments: any[]
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
  attachments: any[]
}

interface ExpensesSummaryProps {
  trip: Trip
}

interface ExpenseItem {
  id: string
  name: string
  type: "flight" | "hotel" | "activity"
  amount: number
  currency: string
  paid: number
  pending: number
  status: "paid" | "pending" | "partial"
}

interface CurrencyTotal {
  currency: string
  total: number
  paid: number
  pending: number
}

export default function ExpensesSummary({ trip }: ExpensesSummaryProps) {
  // Recopilar todos los gastos
  const expenses: ExpenseItem[] = []

  // Añadir vuelos con precio
  trip.flights.forEach((flight) => {
    if (flight.price && flight.price > 0) {
      expenses.push({
        id: flight.id,
        name: `${flight.airline} ${flight.flightNumber}`,
        type: "flight",
        amount: flight.price,
        currency: flight.currency || "EUR",
        paid: flight.price,
        pending: 0,
        status: "paid",
      })
    }
  })

  // Añadir hoteles
  trip.hotels.forEach((hotel) => {
    if (hotel.price && hotel.price > 0) {
      const paid =
        hotel.paymentStatus === "paid"
          ? hotel.price
          : hotel.paymentStatus === "partial"
            ? hotel.price - (hotel.pendingAmount || 0)
            : 0

      const pending = hotel.paymentStatus === "pending" ? hotel.price : hotel.pendingAmount || 0

      expenses.push({
        id: hotel.id,
        name: hotel.name,
        type: "hotel",
        amount: hotel.price,
        currency: hotel.currency || "EUR",
        paid,
        pending,
        status: hotel.paymentStatus || "pending",
      })
    }
  })

  // Añadir actividades
  trip.activities.forEach((activity) => {
    if (activity.price && activity.price > 0) {
      expenses.push({
        id: activity.id,
        name: activity.name,
        type: "activity",
        amount: activity.price,
        currency: activity.currency || "EUR",
        paid: activity.price,
        pending: 0,
        status: "paid",
      })
    }
  })

  // Calcular totales por moneda
  const currencyTotals: CurrencyTotal[] = []

  expenses.forEach((expense) => {
    const existing = currencyTotals.find((ct) => ct.currency === expense.currency)
    if (existing) {
      existing.total += expense.amount
      existing.paid += expense.paid
      existing.pending += expense.pending
    } else {
      currencyTotals.push({
        currency: expense.currency,
        total: expense.amount,
        paid: expense.paid,
        pending: expense.pending,
      })
    }
  })

  // Ordenar por total descendente
  currencyTotals.sort((a, b) => b.total - a.total)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "flight":
        return <Plane className="w-4 h-4 text-blue-500" />
      case "hotel":
        return <Building2 className="w-4 h-4 text-purple-500" />
      case "activity":
        return <MapPin className="w-4 h-4 text-green-500" />
      default:
        return <CreditCard className="w-4 h-4 text-gray-500" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "flight":
        return "Vuelo"
      case "hotel":
        return "Hotel"
      case "activity":
        return "Actividad"
      default:
        return "Gasto"
    }
  }

  const getStatusColor = (status: string) => {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Pagado"
      case "partial":
        return "Parcial"
      case "pending":
        return "Pendiente"
      default:
        return "Sin especificar"
    }
  }

  if (expenses.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-lg border-0 shadow-2xl">
        <CardContent className="text-center py-12">
          <DollarSign className="w-16 h-16 mx-auto text-green-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No hay gastos registrados</h3>
          <p className="text-blue-200 mb-4">
            Añade precios a tus vuelos, hoteles y actividades para ver el resumen de gastos
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Resumen por moneda */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currencyTotals.map((currencyTotal) => {
          const paidPercentage = currencyTotal.total > 0 ? (currencyTotal.paid / currencyTotal.total) * 100 : 0

          return (
            <Card key={currencyTotal.currency} className="bg-white/10 backdrop-blur-lg border-0 shadow-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center justify-between">
                  <span className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Total {currencyTotal.currency}
                  </span>
                  <Badge variant="outline" className="border-white/30 text-white">
                    {Math.round(paidPercentage)}% pagado
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">Total</span>
                    <span className="text-white font-semibold">
                      {currencyTotal.total.toFixed(2)} {currencyTotal.currency}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-300">Pagado</span>
                    <span className="text-green-200 font-medium">
                      {currencyTotal.paid.toFixed(2)} {currencyTotal.currency}
                    </span>
                  </div>
                  {currencyTotal.pending > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-red-300">Pendiente</span>
                      <span className="text-red-200 font-medium">
                        {currencyTotal.pending.toFixed(2)} {currencyTotal.currency}
                      </span>
                    </div>
                  )}
                </div>

                <Progress value={paidPercentage} className="h-2 bg-white/20" />

                {currencyTotal.pending > 0 && (
                  <div className="flex items-center text-xs text-orange-300">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Tienes pagos pendientes
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Desglose detallado */}
      <Card className="bg-white/10 backdrop-blur-lg border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Desglose de Gastos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getTypeIcon(expense.type)}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">{expense.name}</div>
                    <div className="text-xs text-blue-200">{getTypeLabel(expense.type)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-semibold text-white">
                      {expense.amount.toFixed(2)} {expense.currency}
                    </div>
                    {expense.pending > 0 && (
                      <div className="text-xs text-red-300">
                        Pendiente: {expense.pending.toFixed(2)} {expense.currency}
                      </div>
                    )}
                  </div>

                  <Badge className={`${getStatusColor(expense.status)} text-white text-xs`}>
                    {getStatusText(expense.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Consejos */}
      <Card className="bg-blue-500/20 backdrop-blur-lg border-0 shadow-2xl">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-200 mb-1">💡 Consejos para gestionar gastos</h4>
              <ul className="text-sm text-blue-300 space-y-1">
                <li>• Para vuelos de ida y vuelta, añade el precio total solo en uno de los vuelos</li>
                <li>• Marca los hoteles como "Pagado" cuando completes el pago</li>
                <li>• Usa "Pago Parcial" si has hecho una reserva con depósito</li>
                <li>• Los gastos se calculan automáticamente desde vuelos, hoteles y actividades</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
