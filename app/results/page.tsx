import { Suspense } from "react";
import ResultsContent from "./ResultsContent";

export default function ResultsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ResultsContent />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-blue-300 text-lg animate-pulse">Finding your perfect board...</div>
    </main>
  );
}
