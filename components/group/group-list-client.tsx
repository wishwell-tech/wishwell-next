'use client';

import { GroupWithRelations } from "@/app/data/group";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { getGroups } from "@/app/data/group";
import { useEffect, useState } from "react";

interface GroupListClientProps {
  groups: GroupWithRelations[];
}

export function GroupListClient() {
  const [groups, setGroups] = useState<GroupWithRelations[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      const { groups } = await getGroups();
      setGroups(groups);
    };
    fetchGroups();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Groups</h2>
        <Button asChild>
          <Link href="/p/people/new-group">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Group
          </Link>
        </Button>
      </div>

      {groups.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            You haven&apos;t joined any groups yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {groups.map((group) => (
            <Card key={group.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {group.imageUrl && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={group.imageUrl} alt={group.name} />
                      <AvatarFallback>{group.name[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  {group.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {group.description && (
                  <p className="text-muted-foreground mb-4">{group.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {group.members.map((member) => (
                    <Avatar key={member.id} className="h-8 w-8">
                      <AvatarImage src={member.user.imageUrl || ''} alt={`${member.user.firstName} ${member.user.lastName}`} />
                      <AvatarFallback>
                        {(member.user.firstName?.[0] || '') + (member.user.lastName?.[0] || '')}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 