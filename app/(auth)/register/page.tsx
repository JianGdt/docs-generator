import { FileText } from "lucide-react";
import RegisterForm from "../../components/forms/Register";
import DescriptionSection from "@//components/DescriptionSection";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <DescriptionSection />
        <RegisterForm />
      </div>
    </div>
  );
}
