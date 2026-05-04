import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, createContext, useContext } from "react";
import type { Note } from "./lib/types";
import { loadNotes } from "./lib/content";
import Garden from "./components/Garden/GardenCanvas";
import ArticleView from "./components/ArticleView";

interface ContentContextValue {
  notes: Note[];
  loading: boolean;
}

const ContentContext = createContext<ContentContextValue>({
  notes: [],
  loading: true,
});

export function useContent() {
  return useContext(ContentContext);
}

function ContentProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes().then((data) => {
      setNotes(data);
      setLoading(false);
    });
  }, []);

  return (
    <ContentContext.Provider value={{ notes, loading }}>
      {children}
    </ContentContext.Provider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ContentProvider>
        <Routes>
          <Route path="/" element={<Garden />} />
          <Route path="/note/:slug" element={<ArticleView />} />
        </Routes>
      </ContentProvider>
    </BrowserRouter>
  );
}
