import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { fetchProductById } from "@/services/productService"

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true)
        const data = await fetchProductById(id)
        setProduct(data)
        setSelectedImage(data.img_1) // image par défaut
      } catch (err) {
        setError("Impossible de charger le produit.")
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [id])

  if (loading) return <p className="text-center mt-10">Chargement...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>
  if (!product) return <p className="text-center mt-10">Produit introuvable</p>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Images */}
      <div>
        <img
          src={selectedImage}
          alt={product.model}
          className="w-full h-96 object-cover rounded-lg shadow"
        />
        <div className="flex gap-4 mt-4">
          {[product.img_1, product.img_2, product.img_3].map(
            (img, index) =>
              img && (
                <img
                  key={index}
                  src={img}
                  alt={`${product.model} ${index + 1}`}
                  className={`w-24 h-24 object-cover rounded cursor-pointer border ${
                    selectedImage === img ? "border-blue-600" : "border-gray-200"
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              )
          )}
        </div>
      </div>

      {/* Infos produit */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {product.brand} - {product.model}
        </h1>
        <p className="text-gray-600 mt-2">{product.description}</p>

        <div className="mt-4 text-sm text-gray-500">
          <p>Date de sortie : {product.release_date}</p>
          <p>Couleur : {product.color}</p>
        </div>

        {/* Tailles & prix */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Tailles disponibles</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {product.stocks && product.stocks.length > 0 ? (
              product.stocks.map((s) => (
                <div
                  key={s.child_id}
                  className={`p-3 border rounded-lg text-center ${
                    s.availability === "Disponible"
                      ? "bg-white hover:shadow cursor-pointer"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <p className="font-medium">{s.size}</p>
                  <p className="text-sm">{s.price}</p>
                  <p className="text-xs">{s.gender}</p>
                </div>
              ))
            ) : (
              <p>Aucune taille disponible</p>
            )}
          </div>
        </div>

        {/* Ajouter panier */}
        <button className="mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition">
          Ajouter au panier
        </button>
      </div>
    </div>
  )
}
