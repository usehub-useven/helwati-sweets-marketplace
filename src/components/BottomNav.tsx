import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Heart, Search, User, LayoutDashboard } from "lucide-react";

type UserRole = "buyer" | "seller";

export function BottomNav() {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("buyer");

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole === "buyer" || savedRole === "seller") {
      setRole(savedRole);
    }
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/70 backdrop-blur-xl">
      <div className="flex justify-around py-2">
        {/* Home – مشترك */}
        <button onClick={() => navigate("/")}>
          <Home />
        </button>

        {/* خيارات الزبون فقط */}
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

        {/* خيار البائع فقط */}
        {role === "seller" && (
          <button onClick={() => navigate("/dashboard")}>
            <LayoutDashboard />
          </button>
        )}

        {/* Profile – مشترك */}
        <button onClick={() => navigate("/profile")}>
          <User />
        </button>
      </div>
    </nav>
  );
}
