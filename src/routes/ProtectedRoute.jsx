import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const qptoken = useSelector((state) => state.auth.qptoken);

  if (!qptoken) {
    return <Navigate to="/signup" replace />;
  }

  return children;
}
