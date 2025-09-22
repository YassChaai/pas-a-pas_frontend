import { useMemo } from "react"

const normalizeOptions = (values = []) =>
  Array.from(
    new Set(
      values
        .filter((value) => value !== undefined && value !== null && value !== "")
        .map((value) => value.toString().trim()),
    ),
  ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))

export default function FiltersPanel({ options, filters, onFiltersChange, onReset }) {
  const brandOptions = useMemo(
    () => normalizeOptions(options?.brands ?? []),
    [options?.brands],
  )
  const colorOptions = useMemo(
    () => normalizeOptions(options?.colors ?? []),
    [options?.colors],
  )
  const sizeOptions = useMemo(
    () => normalizeOptions(options?.sizes ?? []),
    [options?.sizes],
  )
  const genderOptions = useMemo(
    () => normalizeOptions(options?.genders ?? []),
    [options?.genders],
  )

  const priceMin = filters.priceMin ?? ""
  const priceMax = filters.priceMax ?? ""
  const hasPriceValues = Boolean(options?.priceRange?.hasValues)

  const handleSelectChange = (event, field) => {
    onFiltersChange({
      ...filters,
      [field]: event.target.value,
    })
  }

  const handlePriceChange = (event, bound) => {
    const value = event.target.value
    onFiltersChange({
      ...filters,
      [bound]: value === "" ? undefined : Number(value),
    })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="brand-filter" className="text-sm font-medium text-gray-700">
            Marque
          </label>
          <select
            id="brand-filter"
            value={filters.brand}
            onChange={(event) => handleSelectChange(event, "brand")}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pasapas-blue"
          >
            <option value="all">Toutes</option>
            {brandOptions.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="color-filter" className="text-sm font-medium text-gray-700">
            Couleur
          </label>
          <select
            id="color-filter"
            value={filters.color}
            onChange={(event) => handleSelectChange(event, "color")}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pasapas-blue"
          >
            <option value="all">Toutes</option>
            {colorOptions.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="size-filter" className="text-sm font-medium text-gray-700">
            Taille
          </label>
          <select
            id="size-filter"
            value={filters.size}
            onChange={(event) => handleSelectChange(event, "size")}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pasapas-blue"
          >
            <option value="all">Toutes</option>
            {sizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="gender-filter" className="text-sm font-medium text-gray-700">
            Genre
          </label>
          <select
            id="gender-filter"
            value={filters.gender}
            onChange={(event) => handleSelectChange(event, "gender")}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pasapas-blue"
          >
            <option value="all">Tous</option>
            {genderOptions.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">Prix (€)</span>
          <div className="flex gap-2">
            <input
              type="number"
              value={priceMin}
              min={options?.priceRange?.min ?? undefined}
              max={options?.priceRange?.max ?? undefined}
              onChange={(event) => handlePriceChange(event, "priceMin")}
              className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pasapas-blue disabled:bg-gray-100 disabled:text-gray-500"
              placeholder="Min"
              disabled={!hasPriceValues}
            />
            <input
              type="number"
              value={priceMax}
              min={options?.priceRange?.min ?? undefined}
              max={options?.priceRange?.max ?? undefined}
              onChange={(event) => handlePriceChange(event, "priceMax")}
              className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pasapas-blue disabled:bg-gray-100 disabled:text-gray-500"
              placeholder="Max"
              disabled={!hasPriceValues}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-pasapas-blue hover:underline"
        >
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  )
}
