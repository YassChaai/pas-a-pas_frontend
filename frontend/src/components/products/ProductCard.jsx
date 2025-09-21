import { useState } from "react"
import ProductModal from "./ProductModal"

export default function ProductCard({ product }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        className="border rounded-lg shadow-sm p-4 bg-white cursor-pointer hover:shadow-md transition flex flex-col"
        onClick={() => setOpen(true)}
      >
        <div className="flex-1 flex items-center justify-center">
          <img
            src={product.img_1}
            alt={product.model}
            className="h-48 object-contain rounded-md"
          />
        </div>

        <div className="mt-4 text-center">
          <h3 className="font-semibold text-gray-900">{product.brand}</h3>
          <p className="text-gray-600 text-sm">{product.model}</p>
        </div>
      </div>

      {open && (
        <ProductModal product={product} onClose={() => setOpen(false)} />
      )}
    </>
  )
}
