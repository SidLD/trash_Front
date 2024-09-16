import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutUs() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">About Us</CardTitle>
        <CardDescription className="text-center">Learn more about our company and mission</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <section>
          <h2 className="mb-2 text-xl font-semibold">Our Story</h2>
          <p className="text-gray-700">
            Founded in 2023, our company was born out of a passion for innovation and a desire to make a positive impact on the world. We started as a small team of dedicated individuals and have since grown into a thriving community of professionals committed to excellence.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold">Our Mission</h2>
          <p className="text-gray-700">
            Our mission is to empower businesses and individuals with cutting-edge technology solutions that drive growth, efficiency, and success. We strive to create products that not only meet the needs of our clients but also contribute to a more sustainable and connected world.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold">Our Values</h2>
          <ul className="text-gray-700 list-disc list-inside">
            <li>Innovation: We constantly push the boundaries of what's possible.</li>
            <li>Integrity: We operate with honesty and transparency in all our dealings.</li>
            <li>Collaboration: We believe in the power of teamwork and diverse perspectives.</li>
            <li>Customer-Centric: Our clients' success is our top priority.</li>
            <li>Sustainability: We're committed to environmentally responsible practices.</li>
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