import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Heart, Search, User, LayoutDashboard } from "lucide-react";

export default function BottomNav() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"buyer" | "seller">("buyer");

  useEffect(() => {
    const savedRole = localStorage.getItem("role") as "buyer" | "seller";
    if (savedRole) setRole(savedRole);
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-xl border-t flex justify-around py-2">
      <button onClick={() => navigate("/")}>
        <Home />
      </button>

      {role === "buyer" && (
        <>
          <button onClick={() => navigate("/favorites")}>
            <Heart />
          </button>
          <button onClick={() => navigate("/search")}>
            <Search />
          </button>
        </>
      )}

      {role === "seller" && (
        <button onClick={() => navigate("/dashboard")}>
          <LayoutDashboard />
        </button>
      )}

      <button onClick={() => navigate("/profile")}>
        <User />
      </button>
    </nav>
  );
}
