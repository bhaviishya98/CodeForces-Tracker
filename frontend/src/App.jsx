import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from '@/pages/Home';
import Header from "@/components/layout/Header";
import { ThemeProvider } from "@/components/theme-provider";

function App({ children }) {
    
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {children}
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<h1>About Us</h1>} />
            <Route path="/contact" element={<h1>Contact Us</h1>} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
