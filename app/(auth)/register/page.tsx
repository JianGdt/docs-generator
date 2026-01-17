import { FileText } from "lucide-react";
import RegisterForm from "../../components/forms/Register";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">AI Docs Generator</h1>
          </div>
          <p className="text-slate-400">
            Generate professional documentation with AI
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}
