'use client'

import React, { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface PdfExportProps {
    recipe: any
    elementId: string
    fileName?: string
}

export function PdfExport({ recipe, elementId, fileName }: PdfExportProps) {
    const [isGenerating, setIsGenerating] = useState(false)

    const handleDownload = async () => {
        const element = document.getElementById(elementId)
        if (!element) return

        try {
            setIsGenerating(true)

            // Create a clean clone for PDF generation if needed, 
            // but for now we'll capture the element as is.
            // We temporarily hide things we don't want in the PDF via CSS if needed.

            const canvas = await html2canvas(element, {
                scale: 2, // Higher quality
                useCORS: true, // Allow external images (like Unsplash)
                allowTaint: true,
                logging: false,
                backgroundColor: '#ffffff', // Ensure white background for PDF
                ignoreElements: (el) => el.classList.contains('no-export')
            })

            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            })

            const imgProps = pdf.getImageProperties(imgData)
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
            pdf.save(fileName || `${recipe.title.replace(/\s+/g, '_')}_Recipe.pdf`)

        } catch (error) {
            console.error('Failed to generate PDF', error)
            alert('Could not generate PDF. Please try again.')
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
            {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Download className="w-4 h-4" />
            )}
            <span className="font-semibold text-sm">Download PDF</span>
        </button>
    )
}
