import { Link } from "react-router-dom"

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.parent_id}`}
      className="block border rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition"
    >
      <img
        src={product.img_1}
        alt={product.model}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 className="font-semibold text-gray-900">{product.brand}</h3>
      <p className="text-gray-600">{product.model}</p>
    </Link>
  )
}
