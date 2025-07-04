"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, X, FileText, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FileUploadProps {
  onUpload: (files: File[]) => void
  onClose: () => void
}

export default function FileUpload({ onUpload, onClose }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    if (files.length > 0) {
      onUpload(files)
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="w-5 h-5 text-blue-500" />
    }
    return <FileText className="w-5 h-5 text-red-500" />
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-lg shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
          <CardTitle>Subir Archivos</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">Arrastra archivos aquí</p>
            <p className="text-sm text-gray-500 mb-4">o haz clic para seleccionar</p>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.gif"
              onChange={handleFileInput}
              className="hidden"
              id="file-input"
            />
            <Button asChild variant="outline">
              <label htmlFor="file-input" className="cursor-pointer">
                Seleccionar Archivos
              </label>
            </Button>
          </div>

          {files.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-3">Archivos seleccionados:</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {getFileIcon(file)}
                      <span className="text-sm text-gray-700 truncate">{file.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-6">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button
              onClick={handleUpload}
              disabled={files.length === 0}
              className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
            >
              Subir {files.length} archivo{files.length !== 1 ? "s" : ""}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
