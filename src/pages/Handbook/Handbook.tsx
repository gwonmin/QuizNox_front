import { memo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { HANDBOOK_LAYERS } from "../../constants/handbookManifest";

const MAIN_CLASS = "flex flex-col items-center p-4 max-w-3xl mx-auto";

function Handbook() {
  return (
    <main className={MAIN_CLASS}>
      <h1 className="text-xl font-bold mb-2 text-center text-foreground">
        Handbook
      </h1>
      <p className="text-xs text-muted-foreground mb-6 text-center">
        권장 학습 순서
      </p>
      <ul className="w-full space-y-3">
        {HANDBOOK_LAYERS.map((layer) => (
          <li key={layer.id}>
            <Link to={`/handbook/${layer.id}`}>
              <Card className="hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-foreground">
                    {layer.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {layer.description && (
                    <p className="text-sm text-muted-foreground">
                      {layer.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default memo(Handbook);
