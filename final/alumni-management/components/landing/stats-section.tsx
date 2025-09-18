import { Card, CardContent } from "@/components/ui/card"

export function StatsSection() {
  const stats = [
    { number: "25,000+", label: "Active Alumni" },
    { number: "800+", label: "Companies Represented" },
    { number: "2,500+", label: "Job Opportunities Posted" },
    { number: "200+", label: "Events This Year" },
  ]

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Our Growing Community</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of professionals who are already part of our thriving alumni network across India
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
