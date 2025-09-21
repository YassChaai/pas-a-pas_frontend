import { useEffect, useState } from "react"
import { fetchProducts } from "@/services/productService"
import ProductCard from "@/components/products/ProductCard"

export default function SneakersPage() {
  const [allProducts, setAllProducts] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)

  const limit = 20
  const totalPages = Math.ceil(allProducts.length / limit)

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        const data = await fetchProducts()

        // Debug clair
        console.log("Réponse complète backend:", data)
        console.log("Produits extraits:", data.products)

        setAllProducts(data.products || [])
      } catch (err) {
        console.error(err)
        setError("Impossible de charger les produits.")
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  useEffect(() => {
    const start = (page - 1) * limit
    const end = start + limit
    setProducts(allProducts.slice(start, end))
  }, [allProducts, page])

  if (loading) return <p className="text-center mt-10">Chargement...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Sneakers</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((p) => <ProductCard key={p.parent_id} product={p} />)
        ) : (
          <p className="col-span-full text-center text-gray-600">
            Aucun produit trouvé.
          </p>
        )}
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded-md ${
            page === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Précédent
        </button>

        <span className="text-gray-700">
          Page {page} / {totalPages}
        </span>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded-md ${
            page === totalPages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Suivant
        </button>
      </div>
    </div>
  )
}
