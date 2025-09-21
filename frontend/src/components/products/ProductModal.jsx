export default function ProductModal({ product, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">
          {product.brand} {product.model}
        </h2>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {product.img_1 && <img src={product.img_1} alt="" className="rounded-md" />}
          {product.img_2 && <img src={product.img_2} alt="" className="rounded-md" />}
          {product.img_3 && <img src={product.img_3} alt="" className="rounded-md" />}
        </div>

        <p className="text-gray-600 mb-2">{product.description}</p>
        <p><strong>Couleur :</strong> {product.color}</p>
        <p><strong>Date sortie :</strong> {product.release_date}</p>
      </div>
    </div>
  )
}
