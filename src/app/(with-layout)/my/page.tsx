import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/widgets/common/Tabs";
import OpponentManageSection from "@/widgets/opponent/OpponentManageSection";
import TechniqueManageSection from "@/widgets/technique/TechniqueManageSection";

export default function ManagePage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Tabs defaultValue="opponent">
        <TabsList>
          <TabsTrigger value="opponent">Opponent</TabsTrigger>
          <TabsTrigger value="technique">Technique</TabsTrigger>
        </TabsList>

        <TabsContent value="opponent">
          <OpponentManageSection />
        </TabsContent>

        <TabsContent value="technique">
          <TechniqueManageSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
