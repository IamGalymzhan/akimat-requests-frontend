import { BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import routes from "./routes/routes.jsx";
import { renderRoutes } from "./routes/renderRoutes.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>{renderRoutes(routes)}</Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
