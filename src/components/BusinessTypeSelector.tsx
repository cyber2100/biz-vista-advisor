
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface BusinessTypeSelectorProps {
  onSelect: (type: string) => void;
}

export function BusinessTypeSelector({ onSelect }: BusinessTypeSelectorProps) {
  const businessTypes = [
    {
      id: "global",
      emoji: "🌍",
      name: "Global Corporation",
      description: "Operate in multiple countries with international influence.",
      examples: "Apple, Amazon, Toyota, Nestlé.",
      industries: "Technology, manufacturing, finance, pharmaceuticals, etc.",
      traits: "Multinational presence, supply chains across continents, extensive capital.",
    },
    {
      id: "regional",
      emoji: "🌐",
      name: "Regional Enterprise",
      description: "Operate across a specific region (e.g., Europe, Southeast Asia).",
      examples: "European banks, Middle Eastern telecom companies.",
      industries: "Energy, telecom, regional retail, logistics.",
      traits: "Multi-country reach within a continent or economic region.",
    },
    {
      id: "national",
      emoji: "🏙️",
      name: "National Business",
      description: "Operate primarily within a single country.",
      examples: "National airlines, major grocery chains, banks.",
      industries: "Healthcare, construction, food, finance.",
      traits: "Often dominant players in their domestic market.",
    },
    {
      id: "local",
      emoji: "🏡",
      name: "Local/SME",
      description: "Local cities, provinces, or communities.",
      examples: "Local restaurants, boutique agencies, repair shops.",
      industries: "Hospitality, retail, personal services.",
      traits: "Limited capital, high customer personalization, fewer than 250 employees typically.",
    },
    {
      id: "digital",
      emoji: "💻",
      name: "Digital/Online-Only Business",
      description: "Potentially global, but operate entirely online.",
      examples: "SaaS platforms, digital content creators, e-commerce sites.",
      industries: "Tech, education, media, software.",
      traits: "Low physical footprint, borderless reach, tech-driven scalability.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {businessTypes.map((type) => (
        <Card key={type.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4">
              <div className="text-2xl font-bold mb-2">
                {type.emoji} {type.name}
              </div>
              <p className="text-sm text-gray-600 mb-4">{type.description}</p>
              <Button 
                onClick={() => onSelect(type.name)} 
                className="w-full"
              >
                Select
              </Button>
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value={type.id}>
                <AccordionTrigger className="px-4">Details</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Examples</p>
                      <p className="text-sm text-gray-500">{type.examples}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Industries</p>
                      <p className="text-sm text-gray-500">{type.industries}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Traits</p>
                      <p className="text-sm text-gray-500">{type.traits}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
