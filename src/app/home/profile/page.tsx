import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileTutor from "./tutorProfile";
export default function ProfileTutorPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Perfil del Tutor
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Llama al componente ProfileTutor */}
          <ProfileTutor />
        </CardContent>
      </Card>
    </div>
  );
}
