import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { fetchProducts, fetchProductStocks } from "@/services/productService"
import ProductCard from "@/components/products/ProductCard"
import FiltersPanel from "@/components/products/FiltersPanel"

export default function SneakersPage() {
  const [allProducts, setAllProducts] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    brand: "all",
    color: "all",
    size: "all",
    gender: "all",
    priceMin: undefined,
    priceMax: undefined,
  })

  const limit = 20
  const searchTerm = (searchParams.get("search") || "").trim().toLowerCase()

  const filterOptions = useMemo(() => {
    if (allProducts.length === 0) {
      return {
        brands: [],
        colors: [],
        sizes: [],
        genders: [],
        priceRange: { min: 0, max: 0, hasValues: false },
      }
    }

    const brands = collectBrands(allProducts)

    const brandFilteredProducts =
      filters.brand === "all"
        ? allProducts
        : allProducts.filter((product) => product.brand === filters.brand)

    const colorOptionsSource = brandFilteredProducts
    const colors = collectColors(colorOptionsSource)

    const colorFilteredProducts =
      filters.color === "all"
        ? brandFilteredProducts
        : brandFilteredProducts.filter((product) =>
            productHasColor(product, filters.color),
          )

    const sizeOptionsSource = colorFilteredProducts
    const sizes = collectSizes(sizeOptionsSource)

    const sizeFilteredProducts =
      filters.size === "all"
        ? colorFilteredProducts
        : colorFilteredProducts.filter((product) =>
            productHasSize(product, filters.size),
          )

    const genderOptionsSource = sizeFilteredProducts
    const genders = collectGenders(genderOptionsSource)

    const genderFilteredProducts =
      filters.gender === "all"
        ? sizeFilteredProducts
        : sizeFilteredProducts.filter((product) =>
            productHasGender(product, filters.gender),
          )

    const priceValues = collectPrices(genderFilteredProducts)
    const hasPriceValues = priceValues.length > 0
    const minPrice = hasPriceValues ? Math.min(...priceValues) : 0
    const maxPrice = hasPriceValues ? Math.max(...priceValues) : 0

    return {
      brands,
      colors,
      sizes,
      genders,
      priceRange: {
        min: Math.floor(minPrice),
        max: Math.ceil(maxPrice),
        hasValues: hasPriceValues,
      },
    }
  }, [allProducts, filters.brand, filters.color, filters.size, filters.gender])

  useEffect(() => {
    if (!filterOptions.priceRange) return

    setFilters((previous) => {
      const { min, max, hasValues } = filterOptions.priceRange
      if (!hasValues) {
        if (previous.priceMin !== undefined || previous.priceMax !== undefined) {
          return { ...previous, priceMin: undefined, priceMax: undefined }
        }
        return previous
      }

      const clampWithinRange = (value) => Math.max(min, Math.min(value, max))

      const nextMin =
        previous.priceMin === undefined
          ? min
          : clampWithinRange(previous.priceMin)
      const nextMax =
        previous.priceMax === undefined
          ? max
          : Math.max(min, clampWithinRange(previous.priceMax))

      const finalMin = Math.min(nextMin, nextMax)
      const finalMax = Math.max(nextMin, nextMax)

      if (finalMin !== previous.priceMin || finalMax !== previous.priceMax) {
        return { ...previous, priceMin: finalMin, priceMax: finalMax }
      }

      return previous
    })
  }, [
    filterOptions.priceRange?.min,
    filterOptions.priceRange?.max,
    filterOptions.priceRange?.hasValues,
  ])

  useEffect(() => {
    if (
      filters.color !== "all" &&
      !filterOptions.colors.includes(filters.color)
    ) {
      setFilters((previous) => ({ ...previous, color: "all" }))
    }
  }, [filters.color, filterOptions.colors])

  useEffect(() => {
    if (filters.size !== "all" && !filterOptions.sizes.includes(filters.size)) {
      setFilters((previous) => ({ ...previous, size: "all" }))
    }
  }, [filters.size, filterOptions.sizes])

  useEffect(() => {
    if (
      filters.gender !== "all" &&
      !filterOptions.genders.includes(filters.gender)
    ) {
      setFilters((previous) => ({ ...previous, gender: "all" }))
    }
  }, [filters.gender, filterOptions.genders])

  const searchFilteredProducts = useMemo(() => {
    if (!searchTerm) return allProducts

    return allProducts.filter((product) => {
      const brand = product.brand?.toLowerCase() || ""
      const model = product.model?.toLowerCase() || ""

      return brand.includes(searchTerm) || model.includes(searchTerm)
    })
  }, [allProducts, searchTerm])

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        const data = await fetchProducts()

        // Debug clair
        console.log("Réponse complète backend:", data)
        console.log("Produits extraits:", data.products)
        const baseProducts = data.products || []

        const productsWithStocks = await Promise.all(
          baseProducts.map(async (product) => {
            try {
              const stocks = await fetchProductStocks(product.parent_id)
              return { ...product, stocks }
            } catch (error) {
              console.error(
                `Impossible de récupérer les stocks pour le produit ${product.parent_id}:`,
                error,
              )
              return { ...product, stocks: [] }
            }
          }),
        )

        setAllProducts(productsWithStocks)
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
    setPage(1)
  }, [
    searchTerm,
    filters.brand,
    filters.color,
    filters.size,
    filters.gender,
    filters.priceMin,
    filters.priceMax,
  ])

  const priceRange = filterOptions.priceRange ?? { min: 0, max: 0 }
  const priceBounds = {
    min: filters.priceMin ?? priceRange.min ?? 0,
    max: filters.priceMax ?? priceRange.max ?? priceRange.min ?? 0,
  }

  const fullyFilteredProducts = useMemo(() => {
    return searchFilteredProducts.filter((product) => {
      const matchesBrand =
        filters.brand === "all" || product.brand === filters.brand

      const productColors = new Set()
      if (product.color) {
        productColors.add(product.color)
      }
      product.stocks?.forEach((stock) => {
        if (stock.color) {
          productColors.add(stock.color)
        }
      })
      const matchesColor =
        filters.color === "all" || productColors.has(filters.color)

      const productSizes = product.stocks?.map((stock) => stock.size) || []
      const matchesSize =
        filters.size === "all" || productSizes.includes(filters.size)

      const productGenders = new Set()
      if (product.gender) {
        productGenders.add(product.gender)
      }
      product.stocks?.forEach((stock) => {
        if (stock.gender) {
          productGenders.add(stock.gender)
        }
      })
      const matchesGender =
        filters.gender === "all" || productGenders.has(filters.gender)

      const priceCandidates = []
      if (product.price) {
        const num = toNumber(product.price)
        if (!Number.isNaN(num)) {
          priceCandidates.push(num)
        }
      }
      product.stocks?.forEach((stock) => {
        if (stock.price) {
          const num = toNumber(stock.price)
          if (!Number.isNaN(num)) {
            priceCandidates.push(num)
          }
        }
      })

      const matchesPrice =
        priceCandidates.length === 0
          ? true
          : priceCandidates.some(
              (price) => price >= priceBounds.min && price <= priceBounds.max,
            )

      return (
        matchesBrand &&
        matchesColor &&
        matchesSize &&
        matchesGender &&
        matchesPrice
      )
    })
  }, [searchFilteredProducts, filters, priceBounds.min, priceBounds.max])

  const resultsCount = fullyFilteredProducts.length
  const totalPages = Math.max(1, Math.ceil(fullyFilteredProducts.length / limit))

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  useEffect(() => {
    const start = (page - 1) * limit
    const end = start + limit
    setProducts(fullyFilteredProducts.slice(start, end))
  }, [fullyFilteredProducts, page])

  if (loading) return <p className="text-center mt-10">Chargement...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold uppercase tracking-[0.2em] text-pasapas-blue inline-block relative after:content-[''] after:block after:h-1 after:w-16 after:bg-pasapas-green after:mt-4 after:mx-auto">
          Sneakers
        </h1>
        {searchTerm ? (
          <p className="mt-4 text-gray-600">
            Résultats pour "{searchParams.get("search")?.trim()}" — {resultsCount} modèle
            {resultsCount > 1 ? "s" : ""}
          </p>
        ) : (
          <p className="mt-4 text-gray-600">
            Explorez {resultsCount} modèle{resultsCount > 1 ? "s" : ""} sélectionné{resultsCount > 1 ? "s" : ""} par Pas à Pas.
          </p>
        )}
      </div>

      <FiltersPanel
        options={filterOptions}
        filters={filters}
        onFiltersChange={setFilters}
        onReset={() =>
          setFilters({
            brand: "all",
            color: "all",
            size: "all",
            gender: "all",
            priceMin: filterOptions.priceRange?.hasValues
              ? filterOptions.priceRange.min
              : undefined,
            priceMax: filterOptions.priceRange?.hasValues
              ? filterOptions.priceRange.max
              : undefined,
          })
        }
      />

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

function normalizeStrings(values = []) {
  return Array.from(
    new Set(
      values
        .filter((value) => value !== undefined && value !== null && value !== "")
        .map((value) => value.toString().trim()),
    ),
  ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
}

function collectBrands(products = []) {
  return normalizeStrings(products.map((product) => product.brand))
}

function collectColors(products = []) {
  return normalizeStrings([
    ...products.map((product) => product.color),
    ...products.flatMap((product) => (product.stocks ?? []).map((stock) => stock.color)),
  ])
}

function collectSizes(products = []) {
  return normalizeStrings(
    products.flatMap((product) => [
      product.size,
      ...(product.stocks ?? []).map((stock) => stock.size),
    ]),
  )
}

function collectGenders(products = []) {
  return normalizeStrings([
    ...products.map((product) => product.gender),
    ...products.flatMap((product) => (product.stocks ?? []).map((stock) => stock.gender)),
  ])
}

function collectPrices(products = []) {
  return products
    .flatMap((product) => {
      const entries = []
      if (product.price) {
        entries.push(toNumber(product.price))
      }
      if (product.stocks) {
        entries.push(
          ...product.stocks
            .filter((stock) => stock.price !== undefined && stock.price !== null)
            .map((stock) => toNumber(stock.price)),
        )
      }
      return entries
    })
    .filter((price) => !Number.isNaN(price))
}

function productHasColor(product, color) {
  if (!color || color === "all") return true
  const target = color.toString().trim().toLowerCase()
  if (product.color?.toString().trim().toLowerCase() === target) return true
  return (product.stocks ?? []).some(
    (stock) => stock.color?.toString().trim().toLowerCase() === target,
  )
}

function productHasSize(product, size) {
  if (!size || size === "all") return true
  const target = size.toString().trim()
  if (product.size?.toString().trim() === target) return true
  return (product.stocks ?? []).some(
    (stock) => stock.size?.toString().trim() === target,
  )
}

function productHasGender(product, gender) {
  if (!gender || gender === "all") return true
  const target = gender.toString().trim().toLowerCase()
  if (product.gender?.toString().trim().toLowerCase() === target) return true
  return (product.stocks ?? []).some(
    (stock) => stock.gender?.toString().trim().toLowerCase() === target,
  )
}

function toNumber(value) {
  if (value === null || value === undefined) return Number.NaN
  const normalized = value
    .toString()
    .replace(/[^0-9,.-]/g, "")
    .replace(/,/g, ".")
  return Number.parseFloat(normalized)
}
