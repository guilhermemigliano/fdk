'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { logout } from '@/app/logout/actions';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
//import { createWeeklyMatchByAdmin } from '@/lib/services/createWeeklyMatchByAdmin';
import { createWeeklyMatch } from '@/lib/services/createWeeklyMatch';
import { toast } from 'sonner';
import { useTransition } from 'react';

type User = {
  name: string;
  image?: string;
  role: 'admin' | 'user';
};

interface HeaderProps {
  user: User | null;
}

export function Header({ user }: HeaderProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push('/login');
    router.refresh(); // garante que o layout atualize
  }

  async function createMatch() {
    startTransition(async () => {
      try {
        const res = await createWeeklyMatch();
        if (res.error) {
          toast.warning('Partida da semana já existente');
        } else {
          toast.success('Partida criada com sucesso!');
        }
      } catch (err: any) {
        toast.warning(err?.message || 'Você não tem permissão para isso.');
      }
    });
  }

  return (
    <header className="w-full border-b bg-background">
      <div className="flex h-14 items-center justify-between px-4">
        {/* ESQUERDA — MENU MOBILE */}
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-64">
              <nav className="flex flex-col gap-4 mt-6">
                <Link href="/" className="text-sm font-medium">
                  Tela inicial
                </Link>

                <Link href="/ranking/gols" className="text-sm font-medium">
                  Ranking geral de gols
                </Link>

                <Link
                  href="/ranking/gols-anual"
                  className="text-sm font-medium"
                >
                  Ranking anual de gols
                </Link>

                <Link
                  href="/ranking/vitorias-anual"
                  className="text-sm font-medium"
                >
                  Ranking vitórias anual
                </Link>

                <Link href="/ranking/vitorias" className="text-sm font-medium">
                  Ranking vitórias geral
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* LOGO */}
          <span className="font-bold text-lg tracking-wide">FDK</span>
        </div>

        {/* DIREITA — USUÁRIO */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {user ? (
              <Button
                variant="ghost"
                className="p-0 rounded-full cursor-pointer"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.image} />
                  <AvatarFallback>
                    {user?.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="p-0 rounded-full cursor-pointer"
              >
                <Avatar className="h-9 w-9  border-zinc-800 border">
                  <AvatarImage src={'/images/user-icon.png'} />
                  <AvatarFallback></AvatarFallback>
                </Avatar>
              </Button>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            {user ? (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/perfil">Perfil</Link>
                </DropdownMenuItem>

                {/* <DropdownMenuItem asChild>
                  <Link href="/minhas-partidas">Minhas partidas</Link>
                </DropdownMenuItem> */}

                <DropdownMenuItem asChild>
                  <Link href="/confirmacoes">Confirmações</Link>
                </DropdownMenuItem>

                {user.role === 'admin' && (
                  <>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link href="/admin/partidas">Partidas</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={createMatch}
                      className="cursor-pointer"
                    >
                      Criar partida
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  Logout
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/cadastrar">Cadastrar</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/login">Login</Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
