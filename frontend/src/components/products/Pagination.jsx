export default function Pagination({ page, totalPages, onChange }) {
  return (
    <div className="flex justify-center items-center space-x-4 mt-6">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="px-4 py-2 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
      >
        Précédent
      </button>
      <span>
        Page {page} sur {totalPages}
      </span>
      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="px-4 py-2 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
      >
        Suivant
      </button>
    </div>
  )
}
