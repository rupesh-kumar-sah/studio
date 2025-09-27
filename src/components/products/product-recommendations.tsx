"use client"

import { useState } from "react"
import { getProductRecommendations, ProductRecommendationsInput } from "@/ai/flows/product-recommendations-flow"
import { ProductCard } from "@/components/products/product-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Loader2 } from "lucide-react"
import { useProducts } from "./product-provider"

interface ProductRecommendationsProps {
  currentProductId: string
}

export function ProductRecommendations({ currentProductId }: ProductRecommendationsProps) {
  const { products, getProductById } = useProducts();
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [boostPopularity, setBoostPopularity] = useState(1)
  const [boostRecency, setBoostRecency] = useState(1)

  const handleGetRecommendations = async () => {
    setLoading(true)
    setRecommendations([])

    const currentProduct = getProductById(currentProductId)
    if (!currentProduct) {
      setLoading(false)
      return
    }

    // Simulate viewing history: current product + 2 other random products from the same category
    const similarProducts = products
      .filter(p => p.category === currentProduct.category && p.id !== currentProductId)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)

    const viewingHistory = [currentProductId, ...similarProducts.map(p => p.id)]
    
    const input: ProductRecommendationsInput = {
      viewingHistory,
      boostPopularity,
      boostRecency,
    }

    try {
      const result = await getProductRecommendations(input)
      if (result && Array.isArray(result.recommendedProducts)) {
        // Filter out products that don't exist in our mock data and the current one
        const validRecommendations = result.recommendedProducts.filter(id => id !== currentProductId && getProductById(id));
        setRecommendations(validRecommendations.slice(0, 2)); // Limit to 2 recommendations
      } else {
        // Fallback on invalid AI response
        setRecommendations(similarProducts.map(p => p.id));
      }
    } catch (error) {
      console.error("Failed to get recommendations:", error)
      // Fallback to simple category-based recommendations on error
      setRecommendations(similarProducts.map(p => p.id))
    } finally {
      setLoading(false)
    }
  }

  const recommendedProducts = recommendations.map(id => getProductById(id)).filter(Boolean) as any[]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tailored For You</CardTitle>
        <CardDescription>Use our AI to find products you'll love.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="boost-popularity">Boost Popularity: {boostPopularity.toFixed(1)}</Label>
            <Slider
              id="boost-popularity"
              min={1}
              max={5}
              step={0.1}
              value={[boostPopularity]}
              onValueChange={(val) => setBoostPopularity(val[0])}
            />
          </div>
          <div>
            <Label htmlFor="boost-recency">Boost Recency: {boostRecency.toFixed(1)}</Label>
            <Slider
              id="boost-recency"
              min={1}
              max={5}
              step={0.1}
              value={[boostRecency]}
              onValueChange={(val) => setBoostRecency(val[0])}
            />
          </div>
        </div>
        <Button onClick={handleGetRecommendations} disabled={loading} className="w-full">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {loading ? 'Thinking...' : 'Get AI Recommendations'}
        </Button>

        {recommendedProducts.length > 0 && (
          <div className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Our Suggestions:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
