import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    image?: string | null;
  };
  categories: {
    id: string;
    name: string;
  }[];
  commentCount: number;
  createdAt: Date;
}

export function PostCard({ id, title, content, author, categories, commentCount, createdAt }: PostCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <div className="flex gap-1 flex-wrap justify-end">
            {categories.map((category) => (
              <Badge key={category.id} variant="outline" className="border-primary/20">
                {category.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3">{content}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={author.image || undefined} alt={author.name} />
            <AvatarFallback>
              {author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{author.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{commentCount}</span>
          </div>
          <time dateTime={createdAt.toISOString()}>
            {formatDistanceToNow(createdAt, { addSuffix: true, locale: es })}
          </time>
        </div>
      </CardFooter>
    </Card>
  );
}
