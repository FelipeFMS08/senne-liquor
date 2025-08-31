import { NavLink, useNavigate } from "react-router";
import { Bell } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";


export function NavigationBar() {
  const { data: session } = authClient.useSession();
  const navigate = useNavigate();

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }  
    return 'U';
  }
  
  const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `${isActive ? 'text-primary underline' : `${navigationMenuTriggerStyle()}`}`;


  return (
    <header className="fixed top-0 z-50 w-full border-b bg-white ">
      <div className="flex justify-between h-14 items-center px-5">
        <div className="mr-4 flex">
          <NavLink to="/" className="mr-6 flex items-center space-x-2">
            <img src="/logo.png" alt="React Logo" className="w-52"/>
            <span className="text-sm text-muted-foreground">Gerenciador de Chamados</span>
          </NavLink>
        </div>

        <NavigationMenu className="flex-1">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavLink to="/dashboard" className={navLinkClassName} end>
                Dashboard
              </NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavLink to="/call-map" className={navLinkClassName}>
                Mapa de Chamados
              </NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavLink to="/call/new" className={navLinkClassName}>
                Registrar Chamado
              </NavLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center justify-end space-x-4">
          {session && session.user ? (
            <>
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.image ?? undefined} alt={session.user.name ?? session.user.email ?? ''} />
                      <AvatarFallback>{getInitials(session.user.name, session.user.email)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user.name ?? 'Usuário'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        navigate('/login');
                      }
                    }
                  })}>
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <NavLink to="/login">
              <Button>Login</Button>
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}