import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/api/v1/products/${id}`);
        setProduct(res.data.data);
        setSelectedImage(res.data.data.img_1);
      } catch {
        setError("Produit introuvable");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  function handleAddToCart() {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/products/${id}` } });
      return;
    }
    if (!selectedStock || selectedStock.availability !== "Disponible") return;
    addToCart(product, selectedStock, 1);
    navigate("/cart");
  }

  if (loading) return <p className="text-center mt-10">Chargement...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="border rounded-lg p-4">
            <img
              src={selectedImage}
              alt={product.model}
              className="w-full h-96 object-contain"
            />
          </div>
          <div className="flex gap-3 mt-4">
            {[product.img_1, product.img_2, product.img_3].map(
              (img, idx) =>
                img && (
                  <img
                    key={idx}
                    src={img}
                    alt={`image-${idx}`}
                    onClick={() => setSelectedImage(img)}
                    className={`w-24 h-24 object-contain cursor-pointer border rounded-md ${
                      selectedImage === img ? "border-blue-600" : "border-gray-300"
                    }`}
                  />
                )
            )}
          </div>
        </div>

        {/* Infos produit */}
        <div>
          <h1 className="text-2xl font-bold mb-2">
            {product.brand} - {product.model}
          </h1>
          <p className="text-gray-600 text-sm text-justify mb-4">
            {product.description}
          </p>

          <div className="mb-4">
            <p>
              <span className="font-semibold">Couleur :</span> {product.color}
            </p>
            <p>
              <span className="font-semibold">Date de sortie :</span>{" "}
              {product.release_date}
            </p>
          </div>

          {/* Tailles & prix */}
          <h2 className="text-lg font-semibold mb-2">Tailles disponibles</h2>
          <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-3">
            {product.stocks && product.stocks.length > 0 ? (
              product.stocks.map((stock) => (
                <label
                  key={stock.child_id}
                  className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
                    stock.availability === "Disponible"
                      ? "hover:bg-gray-100"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <input
                    type="radio"
                    name="stock"
                    value={stock.child_id}
                    disabled={stock.availability !== "Disponible"}
                    onChange={() => setSelectedStock(stock)}
                    className="mr-2"
                  />
                  <span>
                    {stock.size} ({stock.gender})
                  </span>
                  <span className="font-medium">{stock.price}</span>
                  <span
                    className={`text-sm ${
                      stock.availability === "Disponible"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {stock.availability}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-gray-500">Aucune taille disponible.</p>
            )}
          </div>

          {/* Bouton ajouter au panier */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedStock || selectedStock.availability !== "Disponible"}
            className={`mt-6 w-full py-3 rounded-md font-medium transition ${
              !selectedStock || selectedStock.availability !== "Disponible"
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
}
