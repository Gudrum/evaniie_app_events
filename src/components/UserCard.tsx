import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserCardProps {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  bio?: string | null;
  role: 'USER' | 'ADMIN';
}

export function UserCard({ id, name, email, image, bio, role }: UserCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={image || undefined} alt={name} />
          <AvatarFallback>
            {name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="grid gap-1">
          <CardTitle className="text-lg">{name}</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{email}</span>
            <Badge variant={role === 'ADMIN' ? "destructive" : "secondary"}>
              {role}
            </Badge>
          </div>
        </div>
      </CardHeader>
      {bio && (
        <CardContent>
          <p className="text-sm text-muted-foreground">{bio}</p>
        </CardContent>
      )}
    </Card>
  );
}
