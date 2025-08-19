import {useEffect, useRef, useState} from "react";
import {Button} from "@/widgets/common/Button";
import {ChevronDown, ChevronRight, Plus} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/widgets/common/Select";
import {Input} from "@/widgets/common/Input";
import {Card, CardContent} from "@/widgets/common/Card";

interface Technique {
  id: number;
  name: string;
  type: "attack" | "defense" | "etc";
  parentId: number | null;
  children?: Technique[];
}

// Dummy API (simulated)
const fetchTechniques = (offset: number): Promise<Technique[]> =>
  new Promise((resolve) =>
    setTimeout(() => {
      const mock: Technique[] = Array.from({length: 10}, (_, i) => ({
        id: offset + i + 1,
        name: `Technique ${offset + i + 1}`,
        type: i % 2 === 0 ? "attack" : "defense",
        parentId: null,
        children: [],
      }));
      resolve(mock);
    }, 500)
  );

export default function TechniqueManageSection() {
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [techniqueName, setTechniqueName] = useState("");
  const [techniqueType, setTechniqueType] = useState<"attack" | "defense" | "etc" | "">("");
  const [expandedTechniques, setExpandedTechniques] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    const more = await fetchTechniques(offset);
    setTechniques((prev) => [...prev, ...more]);
    setOffset((prev) => prev + more.length);
    setLoading(false);
  };

  useEffect(() => {
    loadMore();
  }, []);

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      {rootMargin: "100px"}
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [observerRef.current]);

  const addTechnique = (parentId: number | null = null) => {
    if (!techniqueName || !techniqueType) return;

    const newTechnique: Technique = {
      id: Date.now(),
      name: techniqueName,
      type: techniqueType,
      parentId,
    };

    if (parentId) {
      setTechniques((prev) =>
        prev.map((t) =>
          t.id === parentId
            ? {
              ...t,
              children: t.children ? [newTechnique, ...t.children] : [newTechnique],
            }
            : t
        )
      );
    } else {
      setTechniques((prev) => [{...newTechnique, children: []}, ...prev]);
    }

    setTechniqueName("");
    setTechniqueType("");
  };

  const toggleTechnique = (id: number) => {
    setExpandedTechniques((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Add New Technique</h3>
          <div className="flex gap-4">
            <Input
              placeholder="Technique name"
              value={techniqueName}
              onChange={(e) => setTechniqueName(e.target.value)}
              className="flex-1"
            />
            <Select
              value={techniqueType}
              onValueChange={(val) =>
                setTechniqueType(val as "attack" | "defense" | "etc")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select type"/>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="attack">Attack</SelectItem>
                <SelectItem value="defense">Defense</SelectItem>
                <SelectItem value="etc">Etc</SelectItem>
              </SelectContent>

            </Select>
            <Button onClick={() => addTechnique()}>
              <Plus className="w-4 h-4 mr-2"/>
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Techniques List */}
      <div className="space-y-3">
        {techniques.map((technique) => (
          <div key={technique.id} className="space-y-2">
            {/* Parent Technique */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {technique.children && technique.children.length > 0 && (
                      <Button
                        onClick={() => toggleTechnique(technique.id)}
                        className="p-1 hover:bg-accent rounded"
                      >
                        {expandedTechniques.has(technique.id) ? (
                          <ChevronDown className="w-4 h-4"/>
                        ) : (
                          <ChevronRight className="w-4 h-4"/>
                        )}
                      </Button>
                    )}
                    <div>
                      <h4 className="font-semibold">{technique.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        technique.type === 'attack'
                          ? 'bg-red-100 text-red-800'
                          : technique.type === 'defense'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                                {technique.type}
                              </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const parentTechniqueName = techniqueName;
                      const parentTechniqueType = techniqueType;
                      addTechnique(technique.id);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1"/>
                    Sub
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Child Techniques */}
            {expandedTechniques.has(technique.id) && technique.children?.map((child) => (
              <Card key={child.id} className="ml-8 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-sm">{child.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        child.type === 'attack'
                          ? 'bg-red-100 text-red-800'
                          : child.type === 'defense'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                                {child.type}
                              </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
        {loading && <div className="text-center py-4">Loading more techniques...</div>}
      </div>
    </div>
  );
}