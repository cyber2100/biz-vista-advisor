
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Index = () => {
  useEffect(() => {
    // This component is just a redirect to the landing page
    document.title = "Business Vista Advisor";
  }, []);

  return <Navigate to="/" replace />;
};

export default Index;
