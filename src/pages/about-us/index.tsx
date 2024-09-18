import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutUs() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">About Us</CardTitle>
        <CardDescription className="text-center"></CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <section>
          <h2 className="mb-2 text-xl font-semibold">Our Mission</h2>
          <p className="text-gray-700">
          NwSSU Food Waste Data Analytics are committed to leveraging data to combat one of the most pressing global challenges. Globally, an estimated one-third of all food produced is wasted, contributing to environmental degradation, economic loss, and food insecurity. Our team of students aims to inform many people on Food wastes.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold">Our Team</h2>
          <ul className="text-gray-700 list-disc list-inside">
          <li>Gilmore Philip P. Mediante - Project Leader</li>
          <li>Dave M. Managaysay - Data Analyst</li>
          <li>Anthony R. Alvarez - Researcher</li>
          <li>John Norbert Jovito - Researcher</li>
          </ul>
        </section>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button asChild>
        </Button>
      </CardFooter>
    </Card>
  )
}